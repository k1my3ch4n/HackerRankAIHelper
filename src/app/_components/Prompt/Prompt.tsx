// todo : handleClick 타입 수정
// todo : type 중복

"use client";

import ReactMarkdown from "react-markdown";
import Highlight from "@/components/Highlight";
import Button from "@/components/Button";
import useToggle from "@/hooks/useToggle";
import QuestionForm from "../QuestionForm";

type TypeKey = "summary" | "hint" | "answer";

const PROMPT_TYPE: Record<TypeKey, string> = {
  summary: "요약",
  hint: "힌트",
  answer: "풀이",
};

const Prompt = ({
  type,
  summary,
  problemTitle,
  onClick,
  isLastElement,
  onToggle,
}: {
  type: TypeKey;
  problemTitle: string;
  summary: string;
  onClick: (type: "summary" | "hint" | "answer") => void;
  isLastElement: boolean;
  onToggle: () => void;
}) => {
  return (
    <>
      <div className="w-1/2 p-[20px] mt-[10px] border border-gray-800 rounded-xl bg-gray-800">
        <p className="pb-[10px]">
          문제 <Highlight text={PROMPT_TYPE[type]} /> : {problemTitle}
        </p>

        <ReactMarkdown children={summary} />

        {isLastElement && (
          <>
            <div className="w-full flex pt-[10px] ">
              {Object.entries(PROMPT_TYPE).map(([key, value]) => {
                return (
                  <Button
                    key={key}
                    className="grow mr-[10px]"
                    theme="white"
                    onClick={() => onClick(key as TypeKey)}
                  >
                    {key === type ? "다른 " : ""}
                    {value}
                  </Button>
                );
              })}

              <Button className="grow" theme="main" onClick={onToggle}>
                다른 문제 풀기
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Prompt;
