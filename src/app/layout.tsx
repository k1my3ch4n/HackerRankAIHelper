import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

import PaperLogyFont from "./fonts";

export const metadata: Metadata = {
  title: "HR Helper",
  description: "HackerRank AI Helper",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={PaperLogyFont.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}
