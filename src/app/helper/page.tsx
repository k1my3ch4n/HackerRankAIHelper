"use client";

import useGeminiApi from "@/api/useGeminiApi";
import Button from "@/components/Button";
import Highlight from "@/components/Highlight";
import { Fragment, useRef } from "react";

import QuestionForm from "../_components/QuestionForm";
import useToggle from "@/hooks/useToggle";

import ReactMarkdown from "react-markdown";
import usePrompts, { TypeKey } from "@/stores/prompts";
import useIsLoading from "@/stores/isLoading";

const PROMPT_TYPE: Record<TypeKey, string> = {
  summary: "요약",
  hint: "힌트",
  answer: "풀이",
};

const helperPage = () => {
  const questionNameRef = useRef("");

  const prompts = usePrompts((state) => state.prompts);
  const isLoading = useIsLoading((state) => state.isLoading);

  const { fetchGeminiData } = useGeminiApi();

  const { isToggle, handleToggle } = useToggle(false);

  const handleFetchClick = (type: TypeKey) => {
    const questionName = questionNameRef.current;

    fetchGeminiData({ questionTitle: questionName, type });
  };

  const isInitialView = prompts.length === 0 && !isLoading;
  const isPrompts = prompts.length > 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-65px)]">
      {isInitialView && (
        <>
          <p className="font-medium text-4xl my-[20px]">
            어떤 <Highlight text="문제" />를 도와드릴까요 ?
          </p>
          <QuestionForm questionRef={questionNameRef} />
        </>
      )}

      {isPrompts &&
        prompts.map(({ type, summary, questionTitle }, index) => {
          return (
            <Fragment key={index}>
              <div className="w-1/2 p-[20px] mt-[10px] border border-gray-800 rounded-xl bg-gray-800">
                <p className="pb-[10px]">
                  문제 <Highlight text={PROMPT_TYPE[type]} /> : {questionTitle}
                </p>

                <ReactMarkdown children={summary} />

                {index === prompts.length - 1 && !isLoading && (
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
              {index === prompts.length - 1 && isToggle && (
                <QuestionForm questionRef={questionNameRef} />
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
