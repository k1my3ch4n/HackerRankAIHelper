import MainLogo from "@/images/main_logo.svg";

const Header = () => {
  return (
    <div className="w-full border-b-[0.5px] border-white px-[24px] py-[16px] flex items-center">
      <MainLogo />
      <p className="ml-[10px] text-xl font-bold">HackerRank AI Helper</p>
    </div>
  );
};

export default Header;
