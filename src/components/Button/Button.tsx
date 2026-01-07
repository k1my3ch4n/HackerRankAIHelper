import { ButtonTheme, BUTTON_THEME_STYLES } from "@/types";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  theme?: ButtonTheme;
}

const Button = ({ className = "", theme = "black", ...props }: ButtonProps) => {
  const baseStyles =
    "rounded-[10px] p-[10px] whitespace-nowrap font-semibold cursor-pointer";

  return (
    <button
      className={`${baseStyles} ${BUTTON_THEME_STYLES[theme]} ${className}`}
      {...props}
    >
      {props.children}
    </button>
  );
};

export default Button;
