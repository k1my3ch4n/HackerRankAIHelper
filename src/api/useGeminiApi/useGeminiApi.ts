"use client";

import useIsLoading from "@/stores/isLoading";
import usePrompts from "@/stores/prompts";

const useGeminiApi = () => {
  const setIsLoading = useIsLoading((state) => state.setIsLoading);
  const setPrompts = usePrompts((state) => state.setPrompts);

  const fetchGeminiData = async ({
    url,
    type = "summary",
  }: {
    url: string;
    type?: "summary" | "hint" | "answer";
  }) => {
    setIsLoading(true);

    try {
      const scrapeResponse = await fetch(`/api/scrape?url=${url}`);
      const scrapeData = await scrapeResponse.json();

      if (!scrapeData) {
        throw new Error("scrape 데이터 설정 에러");
      }

      const { title, content } = scrapeData;

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, title, content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP 오류: ${response.status}`);
      }

      const result = await response.json();

      const newPrompt = {
        type,
        url,
        summary: result.summary,
      };

      setPrompts(newPrompt);
    } catch (error) {
      console.error("Gemini API 호출 중 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchGeminiData };
};

export default useGeminiApi;
