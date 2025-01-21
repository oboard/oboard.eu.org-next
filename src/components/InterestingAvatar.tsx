"use client";
import Image from "next/image";

export default function InterestingAvatar() {
  return (
    <div className="w-full h-full relative group">
      {/* 光晕效果 */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/30 to-secondary/30 blur-xl group-hover:blur-2xl transition-all duration-500" />
      
      {/* 头像容器 */}
      <div className="relative w-full h-full rounded-full overflow-hidden shadow-xl 
        hover:scale-105 hover:rotate-6 transition-all duration-500
        ">
        <Image
          src="https://obscloud.ulearning.cn/resources/web/1715838718885.png"
          alt="头像"
          className="object-cover"
          fill
          sizes="(max-width: 640px) 12rem,
                 (max-width: 768px) 14rem,
                 18rem"
          priority
        />
      </div>
      
      {/* 装饰环 */}
      <div className="absolute -inset-2 rounded-full border-2 border-primary/30 
        group-hover:border-primary/50 group-hover:scale-105 transition-all duration-500" />
      <div className="absolute -inset-4 rounded-full border-2 border-secondary/20 
        group-hover:border-secondary/40 group-hover:scale-105 transition-all duration-500" />
    </div>
  );
}
