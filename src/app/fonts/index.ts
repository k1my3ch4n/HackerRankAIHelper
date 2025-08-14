import localFont from "next/font/local";

const PaperLogyFont = localFont({
  src: [
    {
      path: "./Paperlogy-1Thin.woff2",
      weight: "100",
      style: "thin",
    },
    {
      path: "./Paperlogy-2ExtraLight.woff2",
      weight: "200",
      style: "extraLight",
    },
    {
      path: "./Paperlogy-3Light.woff2",
      weight: "300",
      style: "light",
    },
    {
      path: "./Paperlogy-4Regular.woff2",
      weight: "400",
      style: "regular",
    },
    {
      path: "./Paperlogy-5Medium.woff2",
      weight: "500",
      style: "medium",
    },
    {
      path: "./Paperlogy-6SemiBold.woff2",
      weight: "600",
      style: "semiBold",
    },
    {
      path: "./Paperlogy-7Bold.woff2",
      weight: "700",
      style: "bold",
    },
    {
      path: "./Paperlogy-8ExtraBold.woff2",
      weight: "800",
      style: "extraBold",
    },
    {
      path: "./Paperlogy-9Black.woff2",
      weight: "900",
      style: "black",
    },
  ],
  display: "swap",
  variable: "--font-paperlogy",
});

export default PaperLogyFont;
