import type React from "react";
import Link from "next/link";
import InterestingAvatar from "@/components/InterestingAvatar";
import FeedItemCard from "@/components/feed/FeedItemCard";
import type { FeedItemInfo, FeedBodyInfo } from "@/models/feed";
import { links } from "@/config";
import Image from "next/image";

export default async function Home() {
  const blogJson = (await (
    await fetch("https://oboard.xlog.app/feed?format=json", { next: { revalidate: 60 } })
  ).json()) as FeedBodyInfo;

  return (
    <article className="min-h-screen w-full">
      <script
        defer
        src="https://cloud.umami.is/script.js"
        data-website-id="5f4911ab-c548-457f-9b3e-d1ed01fb29c0"
      />

      {/* Hero Section - 全屏展示区 */}
      <div className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10">
        {/* 背景动效 */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:60px_60px] motion-safe:animate-grid-slate" />
          <div className="absolute inset-0 backdrop-blur-[2px]" />
        </div>

        <div className="container mx-auto px-4 z-10 pt-24 md:pt-32">
          <div className="flex flex-col md:flex-row items-center md:justify-between gap-16 md:gap-20">
            {/* 文字区域 - 在桌面端靠左 */}
            <div className="text-center md:text-left max-w-3xl order-2 md:order-1">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-8 leading-tight">
                <span className="block mb-4 animate-fade-in-up [animation-delay:200ms]">
                  Hello，这里是
                </span>
                <span className="block bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent bg-[size:200%] animate-fade-in-up [animation-delay:400ms]">
                  一块小板子
                </span>
                <span className="block mt-4 animate-fade-in-up [animation-delay:600ms]">
                  的主页
                </span>
              </h1>
              <p className="text-xl sm:text-2xl md:text-3xl text-base-content/80 animate-fade-in-up [animation-delay:800ms]">
                计算机专业大三在读
                <span className="hidden sm:inline"> | </span>
                <br className="sm:hidden" />
                全栈开发工程师
              </p>
            </div>

            {/* 头像区域 - 在桌面端靠右 */}
            <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-[400px] md:h-[400px] relative group order-1 md:order-2 flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full animate-spin-slow blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
              <div className="relative w-full h-full animate-float">
                <InterestingAvatar />
              </div>
            </div>
          </div>
        </div>

        {/* 底部渐变 */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-base-100 to-transparent" />
      </div>

      {/* Blog Section - 博客展示区 */}
      <div className="bg-base-100 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">最新文章</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogJson.items.map((item) => (
              <FeedItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* Links Section - 链接展示区 */}
      <div className="relative bg-base-200/50 py-32">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
          <div className="absolute w-96 h-96 bg-primary/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
          <div className="absolute w-96 h-96 bg-secondary/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {links.map((category) => (
              <div 
                key={category.name} 
                className="backdrop-blur-sm bg-base-100/30 rounded-2xl p-8 border border-base-content/5 hover:shadow-lg transition-all"
              >
                <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {category.name}
                </h2>
                <div className="grid gap-4">
                  {category.children.map((item) => (
                    <Link
                      href={item.url}
                      key={item.name}
                      className="group flex items-center gap-3 p-4 rounded-xl hover:bg-base-200/50 transition-all hover:scale-[1.02]"
                    >
                      {/* 头像或默认图标 */}
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center group-hover:shadow-md transition-all">
                        {item.avatar ? (
                          <Image
                            src={item.avatar}
                            alt={item.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <i className="i-tabler-link text-xl text-primary" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <span className="font-medium text-base-content/90 group-hover:text-primary transition-colors">
                          {item.name}
                        </span>
                        {/* 显示链接的域名 */}
                        <p className="text-sm text-base-content/60 group-hover:text-base-content/80 transition-colors">
                          {new URL(item.url).hostname.replace('www.', '')}
                        </p>
                      </div>
                      <i className="i-tabler-chevron-right text-base-content/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center bg-base-100">
        <p className="text-base-content/60">
          © 2024 oboard. All Rights Reserved.
        </p>
      </footer>

    </article>
  );
}
