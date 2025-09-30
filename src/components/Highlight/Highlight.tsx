const Highlight = ({
  text = "",
  className = "",
}: {
  text?: string;
  className?: string;
}) => {
  return <span className={`${className} text-main`}>{text}</span>;
};

export default Highlight;
