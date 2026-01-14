"use client";

import useError from "@/stores/error";
import useIsLoading from "@/stores/isLoading";
import usePrompts from "@/stores/prompts";
import type {
  PromptType,
  ScrapeSuccessResponse,
  GeminiSuccessResponse,
  ApiErrorResponse,
} from "@/types";

const useGeminiApi = () => {
  const setIsLoading = useIsLoading((state) => state.setIsLoading);
  const setPrompts = usePrompts((state) => state.setPrompts);
  const { setError, clearError } = useError();

  const fetchGeminiData = async ({
    url,
    type = "summary",
  }: {
    url: string;
    type?: PromptType;
  }) => {
    setIsLoading(true);
    clearError();

    try {
      const scrapeResponse = await fetch(
        `/api/scrape?url=${encodeURIComponent(url)}`
      );

      if (!scrapeResponse.ok) {
        const scrapeError: ApiErrorResponse = await scrapeResponse.json();
        throw new Error(
          scrapeError.error || "문제 페이지를 불러오는데 실패했습니다."
        );
      }

      const scrapeData: ScrapeSuccessResponse = await scrapeResponse.json();

      if (!scrapeData || !scrapeData.title || !scrapeData.content) {
        throw new Error("문제 데이터를 추출하지 못했습니다.");
      }

      const { title, content } = scrapeData;

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, title, content }),
      });

      if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json();
        throw new Error(errorData.error || "AI 응답을 받는데 실패했습니다.");
      }

      const result: GeminiSuccessResponse = await response.json();

      if (!result.summary) {
        throw new Error("AI 응답이 비어있습니다.");
      }

      const newPrompt = {
        type,
        url,
        summary: result.summary,
      };

      setPrompts(newPrompt);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.";
      setError(errorMessage);
      console.error("Gemini API 호출 중 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchGeminiData };
};

export default useGeminiApi;
