"use client";

import useIsLoading from "@/stores/isLoading";
import usePrompts from "@/stores/prompts";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

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

      const prompts = {
        summary: `
        너는 이제부터 프로그래밍 문제를 분석하고 번역하는 전문가야.

        **주의:** 모든 응답은 반드시 아래 마크다운(Markdown) 형식으로 작성해 줘. HTML 태그나 일반 텍스트 형식은 절대 사용하지 마.

        문제 html: ${content}
        
        위 html 문제에 대해서 다음 마크다운 형식으로 응답해 줘 :
        
        # 문제 요약 결과 : ${title} 

        ## 문제 내용 요약
        (요약된 핵심 요구 사항)        
      `,
        hint: `
        너는 이제부터 프로그래밍 문제 해결을 도와주는 멘토야.

        **주의:** 모든 응답은 반드시 아래 마크다운(Markdown) 형식으로 작성해 줘. HTML 태그나 일반 텍스트 형식은 절대 사용하지 마.

        문제 html: ${content}

        위 html 문제에 대해서 직접적인 답을 제공하지 말고, 다음 마크다운 형식으로 응답해 줘 :

        # 문제 해결 힌트 : ${title} 

        ## 1. 문제 해결 힌트
        (단계별 힌트 내용)

        ## 2. 핵심 알고리즘
        (알고리즘 및 자료구조 설명)
      `,
        answer: `
        너는 이제부터 프로그래밍 문제의 모범 답안을 제시하는 전문가야.

        **주의:** 모든 응답은 반드시 아래 마크다운(Markdown) 형식으로 작성해 줘. HTML 태그나 일반 텍스트 형식은 절대 사용하지 마.

        문제 html: ${content}

        위 html 문제에 대해서 다음 마크다운 형식으로 응답해 줘 :

        # 문제 풀이 : ${title} 

        ## 1. 문제 풀이 코드
        (자바스크립트 코드 블록)

        ## 2. 코드 설명
        (코드 로직 설명)
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
        url,
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
