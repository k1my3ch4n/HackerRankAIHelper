"use client";

import MainLogo from "@/images/main_logo.svg";
import GitHubLogo from "@/images/github.svg";
import Highlight from "@/components/Highlight";
import { useRouter } from "next/navigation";
import { GITHUB_URL, HOME_URL } from "@/constants/urls";

const Header = () => {
  const router = useRouter();

  const handleHomeButtonClick = () => {
    router.push(HOME_URL);
  };

  const handleGithubButtonClick = () => {
    window.open(GITHUB_URL, "_blank");
  };

  return (
    <div className="w-full flex justify-center border-b border-gray-600 px-[24px] py-[16px] md:justify-start fixed top-0 bg-[#0a0a0a]">
      <div className="md:justify-between w-full flex justify-center items-center">
        <div className="flex cursor-pointer" onClick={handleHomeButtonClick}>
          <MainLogo />
          <p className="ml-[10px] text-xl font-bold">
            HackerRank <Highlight text="AI" /> Helper
          </p>
        </div>
        <div
          className="md:block flex cursor-pointer hidden"
          onClick={handleGithubButtonClick}
        >
          <GitHubLogo />
        </div>
      </div>
    </div>
  );
};

export default Header;
