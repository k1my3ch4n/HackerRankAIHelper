// todo : handleClick 타입 수정

"use client";

import useGeminiApi from "@/api/useGeminiApi";
import Button from "@/components/Button";
import Highlight from "@/components/Highlight";
import { problemInputFilter } from "@/utils/regexUtils";
import { useState } from "react";

import ReactMarkdown from "react-markdown";

type TypeKey = "summary" | "hint" | "answer";
interface PromptDataType {
  type: TypeKey;
  problemTitle: string;
  summary: string;
}

const PROMPT_TYPE: Record<TypeKey, string> = {
  summary: "요약",
  hint: "힌트",
  answer: "풀이",
};

const helperPage = () => {
  const [problem, setProblem] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [prompt, setPrompt] = useState<PromptDataType[]>([]);

  const { fetchGeminiData } = useGeminiApi();

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
      await fetchGeminiData({ problemTitle: problemName, setPrompt });
    } else {
      setErrorMessage("잘못된 URL 또는 잘못된 문제 이름입니다.");
    }
  };

  const handleFetchClick = async (type: "summary" | "hint" | "answer") => {
    const { problemName } = problemInputFilter({ problem });

    await fetchGeminiData({ problemTitle: problemName, setPrompt, type });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-65px)]">
      {prompt.length > 0 ? (
        prompt.map(({ type, summary, problemTitle }, index) => {
          console.log(summary);
          return (
            <div
              className="w-1/2 p-[20px] mt-[10px] border border-gray-800 rounded-xl bg-gray-800"
              key={index}
            >
              <p className="pb-[10px]">
                문제 <Highlight text={PROMPT_TYPE[type]} /> : {problemTitle}
              </p>

              <ReactMarkdown children={summary} />

              <div className="w-full flex pt-[10px] ">
                {Object.entries(PROMPT_TYPE).map(([key, value]) => {
                  return (
                    <Button
                      key={key}
                      className="grow mr-[10px]"
                      theme="white"
                      onClick={() => handleFetchClick(key as TypeKey)}
                    >
                      {key === type ? "다른 " : ""}
                      {value}
                    </Button>
                  );
                })}

                <Button className="grow" theme="main">
                  다른 문제 풀기
                </Button>
              </div>
            </div>
          );
        })
      ) : (
        <>
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
              <p className="absolute bottom-[-24px] text-red-400">
                {errorMessage}
              </p>
            )}
          </form>
        </>
      )}
    </div>
  );
};

export default helperPage;
