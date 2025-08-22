interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  theme?: "black" | "main" | "white";
}

const Button = ({ className = "", theme = "black", ...props }: ButtonProps) => {
  const buttonClassName =
    "rounded-[10px] p-[10px] whitespace-nowrap font-semibold cursor-pointer";

  const buttonTheme = {
    black: "border border-white bg-black hover:bg-gray-700",
    main: "border border-main bg-main text-black hover:bg-main-hover",
    white: "border border-main bg-white text-black hover:bg-gray-300",
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
