// todo : Highlight 만들어서 적용, 하지만 약간 안이쁜거 같기도 하고..
import Highlight from "@/components/Highlight";

import NavigateButton from "@/components/NavigateButton";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-65px)]">
      <div className="flex flex-col items-center px-[24px]">
        <div className="text-5xl md:text-6xl font-semibold p-[24px] text-center">
          HackerRank AI Helper
        </div>
        <div className="text-2xl md:text-3xl text-gray-500 px-[10px] pb-[10px] break-keep">
          <Highlight text="HackerRank" />의 문제를 <Highlight text="해석" />
          하고 <Highlight text="요약" />
          해주며,
        </div>
        <div className="text-2xl md:text-3xl text-gray-500 px-[10px] break-keep">
          <Highlight text="힌트" />를 받고 <Highlight text="풀이" />에 도움을
          주는 <Highlight text="AI 도구" />
          입니다.
        </div>
        <div className="w-full flex justify-center mt-[36px]">
          <NavigateButton
            url="/helper"
            className="mr-[10px]"
            text="문제풀러 가기"
          />
          <NavigateButton url="/" theme="main" text="Github" />
        </div>
      </div>
    </div>
  );
};

export default Home;
