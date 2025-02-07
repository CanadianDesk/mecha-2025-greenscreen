import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Full Walkout",
};

export default function PreMatchLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}