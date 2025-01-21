"use client";

import type React from "react";
import Link from "next/link";
import InterestingAvatar from "@/components/InterestingAvatar";
import FeedItemCard from "@/components/feed/FeedItemCard";
import type { FeedBodyInfo } from "@/models/feed";
import { links } from "@/config";
import Image from "next/image";
import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect } from "react";

export default function Home() {
  const [blogJson, setBlogJson] = useState<FeedBodyInfo | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("https://oboard.xlog.app/feed?format=json", { next: { revalidate: 60 } });
      const data = await response.json();
      setBlogJson(data);
    };
    fetchData();
  }, []);

  const { scrollYProgress } = useScroll();

  // 计算透明度和缩放
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  return (
    <article className="min-h-screen w-full">
      <script
        defer
        src="https://cloud.umami.is/script.js"
        data-website-id="5f4911ab-c548-457f-9b3e-d1ed01fb29c0"
      />

      {/* 进度条 */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Hero Section - 全屏展示区 */}
      <motion.div
        className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10"
        style={{
          opacity: heroOpacity,
          scale: heroScale,
        }}
      >
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
            <div className="w-48 h-48 sm:w-56 sm:h-56 xl:w-[400px] xl:h-[400px] relative group order-1 md:order-2 flex-shrink-0">
              <div className="absolute inset-0 animate-spin-slow" />
              <div className="relative w-full h-full animate-float">
                <InterestingAvatar />
              </div>
            </div>
          </div>
        </div>

        {/* 滚动提示 */}
        <motion.div 
          className="absolute bottom-12 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 cursor-pointer"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          {/* <span className="text-base-content/60 text-sm font-medium">更多</span> */}
          <motion.div
            className="w-6 h-6 text-primary"
            animate={{
              y: [0, 8, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <i className="i-tabler-chevron-down text-primary w-8 h-8" />
          </motion.div>
        </motion.div>

        {/* 底部渐变 */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-base-100 to-transparent" />
      </motion.div>

      {/* Blog Section - 博客展示区 */}
      <div className="bg-base-100 py-20">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12"
          >
            最新文章
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogJson?.items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <FeedItemCard item={item} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Links Section - 链接展示区 */}
      <div className="relative bg-base-200/50 py-32">
        <motion.div
          className="absolute inset-0 overflow-hidden"
          style={{
            opacity: useTransform(
              scrollYProgress,
              [0.5, 0.8],
              [0, 1]
            )
          }}
        >
          {/* 背景装饰 */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
          <div className="absolute w-96 h-96 bg-primary/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
          <div className="absolute w-96 h-96 bg-secondary/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse" />
        </motion.div>

        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {links.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
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
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer with fade in */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-8 text-center bg-base-100"
      >
        <p className="text-base-content/60">
          © 2024 oboard. All Rights Reserved.
        </p>
      </motion.footer>
    </article>
  );
}
