// todo : Highlight 만들어서 적용, 하지만 약간 안이쁜거 같기도 하고..
// todo : 페이지 생성시 버튼 분리 및 컴포넌트화
import Highlight from "@/components/Highlight";

const Home = () => {
  return (
    <div className="flex flex-col items-center my-[80px] px-[24px]">
      <div className="flex flex-col items-center pt-[64px] px-[24px]">
        <div className="text-6xl font-semibold p-[24px]">
          HackerRank AI Helper
        </div>
        <div className="text-3xl pb-[10px] text-gray-500">
          <Highlight text="HackerRank" />의 문제를 <Highlight text="해석" />
          하고 <Highlight text="요약" />
          해주며,
        </div>
        <div className="text-3xl text-gray-500">
          <Highlight text="힌트" />를 받고 <Highlight text="풀이" />에 도움을
          주는 <Highlight text="AI 도구" />
          입니다.
        </div>
        <div className="w-full flex justify-center mt-[36px]">
          <button className="border border-white px-[16px] py-[12px] rounded-xl text-black font-semibold mr-[10px] cursor-pointer bg-white">
            문제풀러 가기
          </button>
          <button className="border border-[#01E92C] px-[16px] py-[12px] rounded-xl text-black font-semibold cursor-pointer bg-[#01E92C]">
            Github
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
