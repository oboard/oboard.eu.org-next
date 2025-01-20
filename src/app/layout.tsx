import Header from "@/components/Header";
import "./globals.css";

import { Toaster } from "react-hot-toast";
import type { Metadata, Viewport } from "next";
import useLive2D from "@/hooks/Live2D";
import Live2DWrapper from "@/components/Live2DWrapper";

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
      <link rel="icon" href="/avatar.jpg" sizes="any" />
      <link rel="apple-touch-icon" href="/avatar.jpg" />

      <body className="flex flex-col justify-center items-center">
        {/* <MouseTracker /> */}
        <Toaster />
        {children}
        <Header />
        <Live2DWrapper />
      </body>
    </html>
  );
}
