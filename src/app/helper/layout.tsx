import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HR Helper 에게 물어보세요 !",
  description: "HackerRank AI Helper 에게 문제를 물어보세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
