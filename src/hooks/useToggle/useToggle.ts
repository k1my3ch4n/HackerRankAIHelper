"use client";

import { useState } from "react";

const useToggle = () => {
  const [isToggle, setIsToggle] = useState<boolean>(false);

  const handleToggle = () => {
    setIsToggle((prev) => !prev);
  };

  return {
    isToggle,
    handleToggle,
  };
};

export default useToggle;
