import LinkCard from "@/components/LinkCard";
import useLive2D from "@/components/live2d";
import "./globals.css";

import { Toaster } from "react-hot-toast";
import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#0069ff",
};

export const metadata: Metadata = {
  title: "一块小板子",
  description: "一个隐蔽的网站捏QAQ",
  metadataBase: new URL("https://oboard.eu.org"),
  openGraph: {
    type: "website",
    url: "https://oboard.eu.org",
    title: "一块小板子",
    description: "一个隐蔽的网站捏QAQ",
    images: {
      url: "https://obscloud.ulearning.cn/resources/web/1715838718885.png",
      alt: "一块小板子",
      width: 720,
      height: 720,
    },
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
