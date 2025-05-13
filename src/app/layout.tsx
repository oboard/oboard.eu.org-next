import NavigationBar from "@/components/NavigationBar";
import "./globals.css";

import { Toaster } from "react-hot-toast";
import type { Metadata, Viewport } from "next";
import useLive2D from "@/hooks/Live2D";
import Live2DWrapper from "@/components/Live2DWrapper";
import { Providers } from '@/components/Providers'

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
    "google-adsense-account": "ca-pub-1951154877218910",
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
      <script async custom-element="amp-ad" src="https://cdn.ampproject.org/v0/amp-ad-0.1.js" />
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1951154877218910"
        crossOrigin="anonymous" />
      <body className="flex flex-col justify-center items-center">
        {/* <MouseTracker /> */}
        <Toaster />
        <Providers>
          <NavigationBar />
          {children}
          <Live2DWrapper />
        </Providers>
        {/* @ts-ignore */}
        <amp-ad width="100vw" height="320"
          type="adsense"
          data-ad-client="ca-pub-1951154877218910"
          data-ad-slot="2501207077"
          data-auto-format="rspv"
          data-full-width="">
          <div overflow="" />
          {/* @ts-ignore */}
        </amp-ad>
      </body>
    </html>
  );
}
