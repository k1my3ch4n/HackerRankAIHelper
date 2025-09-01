// todo : prompt 임시 제거
// todo : problem << 전역 상태로
// todo : 맨 처음 로딩 시, 스피너 표현하고 싶음

"use client";

import useGeminiApi from "@/api/useGeminiApi";
import Button from "@/components/Button";
import Highlight from "@/components/Highlight";
import { Fragment, useRef, useState } from "react";

import QuestionForm from "../_components/QuestionForm";
import useToggle from "@/hooks/useToggle";

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
  const questionNameRef = useRef("");

  const [problem, setProblem] = useState<string>("");
  const [prompt, setPrompt] = useState<PromptDataType[]>([]);

  const { fetchGeminiData, isLoading } = useGeminiApi();

  const { isToggle, handleToggle } = useToggle(false);

  const handleFetchClick = async (type: "summary" | "hint" | "answer") => {
    const problemName = questionNameRef.current;

    await fetchGeminiData({ problemTitle: problemName, setPrompt, type });
  };

  console.log(isLoading);

  const isInitialView = prompt.length === 0;
  const isPrompt = prompt.length > 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-65px)]">
      {isInitialView && (
        <>
          <p className="font-medium text-4xl my-[20px]">
            어떤 <Highlight text="문제" />를 도와드릴까요 ?
          </p>
          <QuestionForm
            question={problem}
            setQuestion={setProblem}
            setPrompt={setPrompt}
            questionRef={questionNameRef}
          />
        </>
      )}

      {isPrompt &&
        prompt.map(({ type, summary, problemTitle }, index) => {
          return (
            <Fragment key={index}>
              <div className="w-1/2 p-[20px] mt-[10px] border border-gray-800 rounded-xl bg-gray-800">
                <p className="pb-[10px]">
                  문제 <Highlight text={PROMPT_TYPE[type]} /> : {problemTitle}
                </p>

                <ReactMarkdown children={summary} />

                {index === prompt.length - 1 && !isLoading && (
                  <>
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

                      <Button
                        className="grow"
                        theme="main"
                        onClick={handleToggle}
                      >
                        다른 문제 풀기
                      </Button>
                    </div>
                  </>
                )}
              </div>
              {index === prompt.length - 1 && isToggle && (
                <QuestionForm
                  question={problem}
                  setQuestion={setProblem}
                  setPrompt={setPrompt}
                  questionRef={questionNameRef}
                />
              )}
            </Fragment>
          );
        })}

      {isLoading && (
        <div className="w-1/2 p-[20px] mt-[10px] border border-gray-800 rounded-xl bg-gray-800">
          <p className="pb-[10px]">Gemini 에게 물어보는중 ..</p>
        </div>
      )}
    </div>
  );
};

export default helperPage;
