const Highlight = ({
  text = "",
  className = "",
}: {
  text?: string;
  className?: string;
}) => {
  return <span className={`${className} text-white`}>{text}</span>;
};

export default Highlight;
