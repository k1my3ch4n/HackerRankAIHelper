"use client";

import { useState } from "react";

const useToggle = (initialToggle = false) => {
  const [isToggle, setIsToggle] = useState<boolean>(initialToggle || false);

  const handleToggle = () => {
    setIsToggle((prev) => !prev);
  };

  const handleOn = () => {
    setIsToggle(true);
  };

  const handleOff = () => {
    setIsToggle(false);
  };

  return {
    isToggle,
    handleOn,
    handleOff,
    handleToggle,
  };
};

export default useToggle;
