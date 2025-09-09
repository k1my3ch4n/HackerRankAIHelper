"use client";

import MainLogo from "@/images/main_logo.svg";
import Highlight from "@/components/Highlight";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/");
  };

  return (
    <div className="w-full border-b border-gray-600 px-[24px] py-[16px]">
      <div
        className="w-fit flex items-center cursor-pointer"
        onClick={handleClick}
      >
        <MainLogo />
        <p className="ml-[10px] text-xl font-bold">
          HackerRank <Highlight text="AI" /> Helper
        </p>
      </div>
    </div>
  );
};

export default Header;
