"use client";

import MainLogo from "@/images/main_logo.svg";
import GitHubLogo from "@/images/github.svg";
import Highlight from "@/components/Highlight";
import { useRouter } from "next/navigation";

const GITHUB_URL = "https://github.com/k1my3ch4n/HackerRankAIHelper";
const HOME_URL = "/";

const Header = () => {
  const router = useRouter();

  const handleHomeButtonClick = () => {
    router.push(HOME_URL);
  };

  const handleGithubButtonClick = () => {
    window.open(GITHUB_URL, "_blank");
  };

  return (
    <div className="w-full flex justify-center border-b border-gray-600 px-[24px] py-[16px] md:justify-start">
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
