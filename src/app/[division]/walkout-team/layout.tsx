import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team Walkout",
};

export default function PreMatchLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}