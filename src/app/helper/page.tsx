"use client";

import useGeminiApi from "@/api/useGeminiApi";
import Button from "@/components/Button";
import Highlight from "@/components/Highlight";
import { Fragment, useRef } from "react";

import QuestionForm from "../_components/QuestionForm";
import useToggle from "@/hooks/useToggle";

import usePrompts, { TypeKey } from "@/stores/prompts";
import useIsLoading from "@/stores/isLoading";
import useQuestionURL from "@/stores/questionURL";
import useError from "@/stores/error";
import MarkdownWrapper from "@/components/MarkdownWrapper";
import useControlScroll from "@/hooks/useControlScroll";

const PROMPT_TYPE: Record<TypeKey, string> = {
  summary: "요약",
  hint: "힌트",
  answer: "풀이",
};

const HelperPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const questionURL = useQuestionURL((state) => state.questionURL);

  const prompts = usePrompts((state) => state.prompts);
  const isLoading = useIsLoading((state) => state.isLoading);
  const { error, clearError } = useError();

  const { fetchGeminiData } = useGeminiApi();

  const { isToggle, handleToggle, handleOff } = useToggle(false);

  useControlScroll(containerRef);

  const handleFetchClick = (type: TypeKey) => {
    handleOff();
    fetchGeminiData({ url: questionURL, type });
  };

  const isInitialView = prompts.length === 0 && !isLoading;
  const isPrompts = prompts.length > 0;

  return (
    <div
      className="flex flex-col items-center justify-center mt-[73px] min-h-[calc(100vh-73px)]"
      ref={containerRef}
    >
      {isInitialView && (
        <>
          <p className="text-3xl font-medium md:text-4xl my-[20px] text-center">
            어떤 <Highlight text="문제" />를 도와드릴까요 ?
          </p>
          <QuestionForm handleOff={handleOff} />
        </>
      )}

      {isPrompts &&
        prompts.map(({ type, summary }, index) => {
          return (
            <Fragment key={index}>
              <div className="w-3/4 lg:w-1/2 p-[20px] my-[20px] border border-gray-800 rounded-xl bg-gray-800">
                <MarkdownWrapper>{summary}</MarkdownWrapper>

                {index === prompts.length - 1 && !isLoading && (
                  <>
                    <div className="w-full flex pt-[10px] flex-col md:flex-row">
                      <div className="flex mb-[10px] md:mb-0">
                        {Object.entries(PROMPT_TYPE).map(([key, value]) => {
                          return (
                            <Button
                              key={key}
                              className="grow mr-[10px] last:mr-0 md:last:mr-[10px]"
                              theme="white"
                              onClick={() => handleFetchClick(key as TypeKey)}
                            >
                              {key === type ? "다른 " : ""}
                              {value}
                            </Button>
                          );
                        })}
                      </div>

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
                <QuestionForm handleOff={handleOff} />
              )}
            </Fragment>
          );
        })}

      {isLoading && (
        <div className="w-3/4 md:w-1/2 p-[20px] my-[20px] border border-gray-800 rounded-xl bg-gray-800">
          <p className="p-[10px] break-keep">Gemini 에게 물어보는중..</p>
        </div>
      )}

      {error && (
        <div className="w-3/4 md:w-1/2 p-[20px] my-[20px] border border-red-500 rounded-xl bg-red-900/30">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-400 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-red-400 break-keep">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="text-red-400 hover:text-red-300 ml-4 flex-shrink-0"
              aria-label="에러 닫기"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelperPage;
