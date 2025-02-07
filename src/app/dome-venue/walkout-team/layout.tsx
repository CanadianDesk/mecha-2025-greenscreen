import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dome Team Walkout",
};

export default function PreMatchLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}