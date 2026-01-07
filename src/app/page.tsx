import Highlight from "@/components/Highlight";
import NavigateButton from "@/components/NavigateButton";
import { GITHUB_URL, HELPER_URL } from "@/constants/urls";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-[73px] min-h-[calc(100vh-73px)]">
      <div className="flex flex-col items-center px-[24px] tracking-wider">
        <div className="md:text-6xl md:flex-row md:justify-center flex flex-col text-5xl font-semibold p-[24px] text-center whitespace-nowrap">
          <span className="md:pr-[10px]">HackerRank</span>
          <span>AI Helper</span>
        </div>
        <div className="md:text-3xl md:flex-row md:justify-center md:pb-[10px] md:w-full text-2xl text-gray-500 px-[10px] w-[330px] break-keep flex flex-col">
          <span className="md:pr-[10px]">
            <Highlight text="HackerRank" />의 문제를
          </span>
          <span>
            <Highlight text="해석" />
            하고 <Highlight text="요약" />
            해주며,
          </span>
        </div>
        <div className="md:text-3xl md:flex-row md:justify-center md:w-full text-2xl text-gray-500 px-[10px] w-[330px] break-keep flex flex-col">
          <span className="md:pr-[10px]">
            <Highlight text="힌트" />를 받고 <Highlight text="풀이" />에 도움을
            주는
          </span>
          <span>
            <Highlight text="AI 도구" /> 입니다.
          </span>
        </div>
        <div className="w-full flex justify-center mt-[36px]">
          <NavigateButton url={HELPER_URL} className="mr-[10px]">
            문제풀러 가기
          </NavigateButton>
          <NavigateButton url={GITHUB_URL} theme="main">
            Github
          </NavigateButton>
        </div>
      </div>
    </div>
  );
};

export default Home;
