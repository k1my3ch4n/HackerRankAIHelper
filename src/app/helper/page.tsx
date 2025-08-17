"use client";

import useTranslateProblem from "@/api/useTranslateProblem";
import { useState } from "react";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;

const helperPage = () => {
  const [problem, setProblem] = useState<string>("");

  const { translatedTitle, summary, errorMessage, fetchTranslateProblem } =
    useTranslateProblem();

  const handleChangeProblem = (value: string) => {
    setProblem(value);
  };

  const handleClick = async () => {
    await fetchTranslateProblem("staircase");
  };

  return (
    <div className="">
      <input
        className="text-white border border-white"
        value={problem}
        onChange={(e) => handleChangeProblem(e.target.value)}
      />
      <button onClick={handleClick}>번역 버튼</button>

      {translatedTitle && <div>제목 : {translatedTitle}</div>}
      {summary && <div>요약 : {summary}</div>}
      {errorMessage && <div>에러가 발생했습니다. : {errorMessage}</div>}
    </div>
  );
};

export default helperPage;
