import MainLogo from "@/images/main_logo.svg";
import Highlight from "../Highlight";

const Header = () => {
  return (
    <div className="w-full border-b border-gray-600 px-[24px] py-[16px] flex items-center">
      <MainLogo />
      <p className="ml-[10px] text-xl font-bold">
        HackerRank <Highlight text="AI" /> Helper
      </p>
    </div>
  );
};

export default Header;
