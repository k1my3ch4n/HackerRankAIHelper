"use client";

import useGeminiApi from "@/api/useGeminiApi";
import Button from "@/components/Button";
import useQuestionURL from "@/stores/questionURL";
import { questionInputFilter } from "@/utils/regexUtils";
import { useState } from "react";

const QuestionForm = ({ handleOff }: { handleOff: () => void }) => {
  const setQuestionURL = useQuestionURL((state) => state.setQuestionURL);

  const [questionInput, setQuestionInput] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { fetchGeminiData } = useGeminiApi();

  const handleChangeQuestion = (value: string) => {
    if (errorMessage) {
      setErrorMessage("");
    }

    setQuestionInput(value);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { isValid, url } = questionInputFilter({
      questionInput,
    });

    if (isValid) {
      handleOff();
      setQuestionURL(url);

      fetchGeminiData({ url });
    } else {
      setErrorMessage("잘못된 URL 또는 잘못된 문제 이름입니다.");
    }
  };

  return (
    <form
      className={`w-3/4 md:w-1/2 flex m-[20px] px-[16px] py-[12px] rounded-xl relative border bg-gray-800 ${
        errorMessage ? "border-red-400" : "border-gray-800"
      }`}
      onSubmit={(e) => handleFormSubmit(e)}
    >
      <div className="flex w-full">
        <input
          className="w-full text-white focus:outline-hidden "
          value={questionInput}
          placeholder="문제 URL 또는 문제 이름을 입력하세요."
          onChange={(e) => handleChangeQuestion(e.target.value)}
        />
        <Button className="ml-[10px]" theme="main">
          찾기
        </Button>
      </div>
      {errorMessage && (
        <p className="absolute bottom-[-24px] text-red-400">{errorMessage}</p>
      )}
    </form>
  );
};

export default QuestionForm;
