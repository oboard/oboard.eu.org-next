import LinkCard from "@/components/LinkCard";
import "./globals.css";

import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "一块小板子",
  description: "一个隐蔽的网站捏QAQ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="flex flex-col justify-center items-center">
        {/* <MouseTracker /> */}
        <Toaster />
        {children}
        <LinkCard />
      </body>
    </html>
  );
}
