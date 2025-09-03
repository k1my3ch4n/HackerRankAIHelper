"use client";

import useIsLoading from "@/stores/isLoading";
import usePrompts from "@/stores/prompts";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;

const useGeminiApi = () => {
  const setIsLoading = useIsLoading((state) => state.setIsLoading);
  const setPrompts = usePrompts((state) => state.setPrompts);

  const fetchGeminiData = async ({
    questionName,
    type = "summary",
  }: {
    questionName: string;
    type?: "summary" | "hint" | "answer";
  }) => {
    setIsLoading(true);

    const prompts = {
      summary: `
        너는 이제부터 프로그래밍 문제를 분석하고 번역하는 전문가야.

        아래에 제시된 hackerrank 페이지의 문제에 대해 다음 형식으로 응답해 줘. 응답의 형식은 마크다운으로 해 줘.

        1.  **문제 제목**: 원본 문제의 제목을 번역해 줘.
        2.  **문제 내용 번역**: 문제 내용을 한국어로 정확하고 자연스럽게 번역해 줘.
        3.  **문제 내용 요약**: 번역된 내용을 바탕으로 문제의 핵심 요구사항을 간결하게 요약해 줘. 이 요약에는 풀이 방법, 힌트, 또는 답이 될 수 있는 어떤 내용도 포함하면 안 돼. 오직 문제의 목표만 요약해야 해.

        ---
        문제: ${questionName}
      `,
      hint: `
        너는 이제부터 프로그래밍 문제 해결을 도와주는 멘토야.

        아래에 제시된 hackerrank 페이지 문제에 대해 직접적인 답을 제공하지 않고, 다음 형식으로 응답해 줘.

        1.  **문제 해결 힌트**: 문제를 푸는 데 필요한 주요 사고 과정이나 접근 방식에 대해 단계별로 힌트를 제공해 줘.
        2.  **핵심 알고리즘**: 이 문제를 해결하는 데 가장 효과적인 알고리즘이나 자료구조를 제시하고, 그 개념에 대해 간결하게 설명해 줘.

        ---
        문제: ${questionName}
      `,
      answer: `
        너는 이제부터 프로그래밍 문제의 모범 답안을 제시하는 전문가야.

        아래에 제시된 hackerrank 페이지의 문제에 대해 다음 형식으로 응답해 줘.

        1.  **문제 풀이 코드**: 문제를 해결하는 자바스크립트(JavaScript) 코드를 작성해 줘. 코드는 가독성이 좋고, 최적화된 방법으로 작성해 줘.
        2.  **코드 설명**: 작성된 코드의 로직과 핵심 원리에 대해 간결하고 이해하기 쉽게 설명해 줘.

        ---
        문제: ${questionName}
      `,
    };

    const payload = {
      contents: [{ parts: [{ text: prompts[type] }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            summary: { type: "STRING" },
          },
          propertyOrdering: ["summary"],
        },
      },
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP 오류: ${response.status}`);
      }

      const result = await response.json();
      const geminiResponse = result?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!geminiResponse) {
        throw new Error("Gemini 응답을 받지 못했습니다.");
      }

      const parsedResponse = JSON.parse(geminiResponse);

      const newPrompt = {
        type,
        questionName,
        summary: parsedResponse.summary,
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
