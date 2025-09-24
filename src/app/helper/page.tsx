"use client";

import useGeminiApi from "@/api/useGeminiApi";
import Button from "@/components/Button";
import Highlight from "@/components/Highlight";
import { Fragment } from "react";

import QuestionForm from "../_components/QuestionForm";
import useToggle from "@/hooks/useToggle";

import usePrompts, { TypeKey } from "@/stores/prompts";
import useIsLoading from "@/stores/isLoading";
import useQuestionName from "@/stores/questionName";
import MarkdownWrapper from "@/components/MarkdownWrapper";

const PROMPT_TYPE: Record<TypeKey, string> = {
  summary: "요약",
  hint: "힌트",
  answer: "풀이",
};

const HelperPage = () => {
  const questionName = useQuestionName((state) => state.questionName);

  const prompts = usePrompts((state) => state.prompts);
  const isLoading = useIsLoading((state) => state.isLoading);

  const { fetchGeminiData } = useGeminiApi();

  const { isToggle, handleToggle, handleOff } = useToggle(false);

  const handleFetchClick = (type: TypeKey) => {
    handleOff();
    fetchGeminiData({ questionName, type });
  };

  const isInitialView = prompts.length === 0 && !isLoading;
  const isPrompts = prompts.length > 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-65px)]">
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
    </div>
  );
};

export default HelperPage;
