"use client";

import { useState } from "react";

const useToggle = (initialToggle = false) => {
  const [isToggle, setIsToggle] = useState<boolean>(initialToggle || false);

  const handleToggle = () => {
    setIsToggle((prev) => !prev);
  };

  return {
    isToggle,
    handleToggle,
  };
};

export default useToggle;
