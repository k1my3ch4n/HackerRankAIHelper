"use client";

import useTranslateProblem from "@/api/useTranslateProblem";
import Button from "@/components/Button";
import Highlight from "@/components/Highlight";
import { problemInputFilter } from "@/utils/regexUtils";
import { useState } from "react";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;

const helperPage = () => {
  const [problem, setProblem] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [prompt, setPrompt] = useState<string[]>([]);

  const {
    //  errorMessage,
    fetchTranslateProblem,
  } = useTranslateProblem();

  const handleChangeProblem = (value: string) => {
    if (errorMessage) {
      setErrorMessage("");
    }

    setProblem(value);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { isValid, problemName } = problemInputFilter({ problem });

    if (isValid) {
      await fetchTranslateProblem({ problemTitle: problemName, setPrompt });
    } else {
      setErrorMessage("잘못된 URL 또는 잘못된 문제 이름입니다.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-65px)]">
      <p className="font-medium text-4xl my-[20px]">
        어떤 <Highlight text="문제" />를 도와드릴까요 ?
      </p>
      <form
        className={`w-1/2 flex mx-[20px] px-[16px] py-[12px] rounded-xl bg-gray-800 relative border border-gray-800 ${
          errorMessage ? "border border-red-400" : ""
        }`}
        onSubmit={(e) => handleFormSubmit(e)}
      >
        <div className="flex w-full">
          <input
            className="w-full text-white focus:outline-hidden "
            value={problem}
            placeholder="문제 URL 또는 문제 이름을 입력하세요."
            onChange={(e) => handleChangeProblem(e.target.value)}
          />
          <Button className="ml-[10px]" theme="main">
            찾기
          </Button>
        </div>
        {errorMessage && (
          <p className="absolute bottom-[-24px] text-red-400">{errorMessage}</p>
        )}
      </form>

      {prompt &&
        prompt.map((data, index) => <div key={index}>요약 : {data}</div>)}
      {/* {errorMessage && <div>에러가 발생했습니다. : {errorMessage}</div>} */}
    </div>
  );
};

export default helperPage;
