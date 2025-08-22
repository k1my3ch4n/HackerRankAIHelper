// todo : PromptType 타입 중복

"use client";

import useTranslateProblem from "@/api/useTranslateProblem";
import Button from "@/components/Button";
import Highlight from "@/components/Highlight";
import { problemInputFilter } from "@/utils/regexUtils";
import { useState } from "react";

import ReactMarkdown from "react-markdown";

// N개의 도시와 N-1개의 도로로 이루어진 트리를 두 개의 왕국으로 나누는 방법의 수를 구하는 문제입니다. 모든 도시는 한 왕국에 속해야 하며, 인접한 도시는 다른 왕국에 속해야 합니다. 각 왕국은 하나의 수도를 가지며, 해당 왕국의 모든 도시는 같은 왕국에 속한 도시들로만 이루어진 경로를 통해 수도에 도달할 수 있어야 합니다. 최종 결과는 10^9 + 7로 나눈 나머지여야 합니다.

interface PromptType {
  type: "summary" | "hint" | "answer";
  problemTitle: string;
  summary: string;
}

const TYPE_TRANSLATE = {
  summary: "요약",
  hint: "힌트",
  answer: "풀이",
};

const helperPage = () => {
  const [problem, setProblem] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [prompt, setPrompt] = useState<PromptType[]>([
    {
      type: "summary",
      problemTitle: "kingdom division",
      summary:
        "N개의 도시와 N-1개의 도로로 이루어진 트리를 두 개의 왕국으로 나누는 방법의 수를 구하는 문제입니다. 모든 도시는 한 왕국에 속해야 하며, 인접한 도시는 다른 왕국에 속해야 합니다. 각 왕국은 하나의 수도를 가지며, 해당 왕국의 모든 도시는 같은 왕국에 속한 도시들로만 이루어진 경로를 통해 수도에 도달할 수 있어야 합니다. 최종 결과는 10^9 + 7로 나눈 나머지여야 합니다.",
    },
  ]);

  const { fetchTranslateProblem } = useTranslateProblem();

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
      {prompt ? (
        prompt.map(({ type, summary, problemTitle }, index) => {
          console.log(summary);
          return (
            <div
              className="w-1/2 p-[20px] mb-[10px] border border-gray-800 rounded-xl bg-gray-800"
              key={index}
            >
              <p className="pb-[10px]">
                문제 <Highlight text={TYPE_TRANSLATE[type]} /> : {problemTitle}
              </p>

              <ReactMarkdown children={summary} />

              <div className="w-full flex pt-[10px] ">
                {Object.entries(TYPE_TRANSLATE).map(([key, value]) => {
                  return (
                    <Button key={key} className="grow mr-[10px]" theme="white">
                      {value}
                      {key === type ? " 다시하기" : ""}
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
