// todo : 메인 색으로 설정, 추후 흰색 / 메인 색 나누어서 설정

const Highlight = ({
  text = "",
  className = "",
}: {
  text?: string;
  className?: string;
}) => {
  return <span className={`${className} text-[#01E92C]`}>{text}</span>;
};

export default Highlight;
