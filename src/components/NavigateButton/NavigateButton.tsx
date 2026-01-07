"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import type { ButtonTheme } from "@/types";

interface NavigateButtonProps {
  url?: string;
  theme?: ButtonTheme;
  className?: string;
  children?: React.ReactNode;
}

const NavigateButton = ({
  url = "/",
  theme = "white",
  className = "",
  children,
}: NavigateButtonProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(url);
  };

  return (
    <Button
      theme={theme}
      className={`px-[16px] py-[12px] rounded-xl ${className}`}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
};

export default NavigateButton;
