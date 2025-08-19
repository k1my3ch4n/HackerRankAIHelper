"use client";

import { useRouter } from "next/navigation";

const NavigateButton = ({
  url = "/",
  theme = "white",
  className = "",
  text = "",
}: {
  url?: string;
  theme?: "main" | "white";
  className?: string;
  text?: string;
}) => {
  const router = useRouter();

  const themeClassName = {
    white: "border border-white bg-white",
    main: "border border-main bg-main",
  };

  const buttonClassName =
    "px-[16px] py-[12px] rounded-xl text-black font-semibold cursor-pointer";

  const handleClick = () => {
    router.push(url);
  };
  return (
    <button
      className={`${buttonClassName} ${themeClassName[theme]} ${className}`}
      onClick={handleClick}
    >
      {text}
    </button>
  );
};

export default NavigateButton;
