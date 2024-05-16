import LinkCard from "@/components/LinkCard";
import "./globals.css";

import { Toaster } from "react-hot-toast";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "一块小板子",
  description: "一个隐蔽的网站捏QAQ",
  themeColor: "#000000",
  openGraph: {
    type: "website",
    url: "https://oboard.eu.org",
    title: "一块小板子",
    description: "一个隐蔽的网站捏QAQ",
    images: [
      {
        url: "https://obscloud.ulearning.cn/resources/web/1715838718885.png",
        alt: "一块小板子",
        width: 1280,
        height: 720,
      },
    ],
  },
  other: {
    name: "一块小板子",
    image: "https://obscloud.ulearning.cn/resources/web/1715838718885.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <link rel="icon" href="/avatar.png" sizes="any" />
      <link rel="apple-touch-icon" href="/avatar.png" />
      <body className="flex flex-col justify-center items-center">
        {/* <MouseTracker /> */}
        <Toaster />
        {children}
        <LinkCard />
      </body>
    </html>
  );
}
