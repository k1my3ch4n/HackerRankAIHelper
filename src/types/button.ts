export type ButtonTheme = "black" | "main" | "white";

export const BUTTON_THEME_STYLES: Record<ButtonTheme, string> = {
  black: "border border-white bg-black hover:bg-gray-700",
  main: "border border-main bg-main text-black hover:bg-main-hover",
  white: "border border-main bg-white text-black hover:bg-gray-300",
};
