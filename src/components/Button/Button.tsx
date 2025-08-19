interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  theme?: "black" | undefined;
}

const Button = ({ className = "", theme = "black", ...props }: ButtonProps) => {
  const buttonClassName = "p-[10px] whitespace-nowrap font-semibold";

  const buttonTheme = {
    black: "border border-white rounded-[10px] bg-black",
  };

  return (
    <button
      className={`${buttonClassName} ${buttonTheme[theme]} ${className}`}
      {...props}
    >
      {props.children}
    </button>
  );
};

export default Button;
