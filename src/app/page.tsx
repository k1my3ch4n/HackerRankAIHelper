// todo : Highlight 만들죠?

const Home = () => {
  return (
    <div className="flex flex-col items-center my-[80px] px-[24px]">
      <div className="flex flex-col items-center pt-[64px] px-[24px]">
        <div className="text-6xl font-semibold p-[24px]">
          HackerRank AI Helper
        </div>
        <div className="text-3xl pb-[10px] text-gray-500">
          <span className="text-white">HackerRank</span>의 문제를{" "}
          <span className="text-white">해석</span>하고{" "}
          <span className="text-white">요약</span>해주며,
        </div>
        <div className="text-3xl text-gray-500">
          <span className="text-white">힌트</span>를 받고{" "}
          <span className="text-white">풀이</span>에 도움을 주는{" "}
          <span className="text-white">AI 도구</span>입니다.
        </div>
      </div>
    </div>
  );
};

export default Home;
