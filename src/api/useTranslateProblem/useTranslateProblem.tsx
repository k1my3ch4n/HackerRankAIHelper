"use client";

import { useState } from "react";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;

const useTranslateProblem = () => {
  const [translatedTitle, setTranslatedTitle] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const fetchTranslateProblem = async (problemTitle: string) => {
    const prompt = `
    다음 HackerRank 문제 제목과 설명을 한국어로 번역해 주세요.
    문제 제목: ${problemTitle}
  `;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            translatedTitle: { type: "STRING" },
            summary: { type: "STRING" },
          },
          propertyOrdering: ["translatedTitle", "summary"],
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
        setErrorMessage(`HTTP 오류: ${response.status}`);
        throw new Error(`HTTP 오류: ${response.status}`);
      }

      const result = await response.json();
      const geminiResponse = result?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!geminiResponse) {
        setErrorMessage("Gemini 응답을 받지 못했습니다.");
        throw new Error("Gemini 응답을 받지 못했습니다.");
      }

      const parsedResponse = JSON.parse(geminiResponse);

      setTranslatedTitle(parsedResponse.translatedTitle);
      setSummary(parsedResponse.summary);
    } catch (error) {
      console.error("Gemini API 호출 중 오류:", error);
      setErrorMessage(`Gemini API 호출 중 오류가 발생했습니다 : ${error}`);
    }
  };

  return {
    translatedTitle,
    summary,
    errorMessage,
    fetchTranslateProblem,
  };
};

export default useTranslateProblem;
