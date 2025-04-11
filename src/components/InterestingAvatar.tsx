"use client";
import Image from "next/image";
import { ability } from "@/config";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRef, useEffect } from "react";

// 定义轨道方向常量
const ORBIT_DIRECTION = {
  Clockwise: "normal",
  CounterClockwise: "reverse",
} as const;

type OrbitDirection = typeof ORBIT_DIRECTION[keyof typeof ORBIT_DIRECTION];

// Orbit 组件
function Orbit({
  children,
  radius,
  duration = 20,
  delay = 10,
  direction = ORBIT_DIRECTION.Clockwise,
  showPath = true,
  className = "",
}: {
  children: React.ReactNode;
  radius: number;
  duration?: number;
  delay?: number;
  direction?: OrbitDirection;
  showPath?: boolean;
  className?: string;
}) {
  const orbitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (orbitRef.current) {
      orbitRef.current.style.setProperty('--radius', `${radius*2}px`);
    }
  }, [radius]);

  return (
    <>
      {showPath && (
        <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
          <title>轨道路径</title>
          <circle
            className="stroke-base-content/30 stroke-[1.5px] dark:stroke-white/30"
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
          />
        </svg>
      )}
      <div
        ref={orbitRef}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-0 w-0 animate-orbit ${className}`}
        style={{
          animationDirection: direction,
          animationDuration: `${duration}s`,
          animationDelay: `${-delay}s`,
        }}
      >
        {children}
      </div>
    </>
  );
}

export default function InterestingAvatar() {
  const [direction, setDirection] = useState<OrbitDirection>(ORBIT_DIRECTION.Clockwise);

  // 切换方向函数
  const switchDirection = () => {
    setDirection(direction === ORBIT_DIRECTION.Clockwise
      ? ORBIT_DIRECTION.CounterClockwise
      : ORBIT_DIRECTION.Clockwise
    );
  };

  // 将所有技术栈图标平铺到一个数组
  const allTechIcons = ability.flatMap(category =>
    category.children.map(tech => ({
      icon: tech.icon,
      name: tech.name,
      category: category.name // 添加分类信息用于不同轨道
    }))
  );

  // 根据分类分配不同的轨道半径
  const getRadius = (category: string) => {
    switch (category) {
      case 'Web': return 120;
      case 'App': return 160;
      case 'AI': return 200;
      case 'Design': return 240;
      default: return 180;
    }
  };

  return (
    <>
      {/* 添加 CSS keyframes */}
      <style jsx global>{`
        @keyframes orbit {
          0% {
            transform: rotate(0deg) translateY(var(--radius)) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateY(var(--radius)) rotate(-360deg);
          }
        }
        
        .animate-orbit {
          animation: orbit 20s linear infinite;
          transform-origin: center;
        }
      `}</style>

      <div className="w-full h-full relative group">
        {/* 光晕效果 */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-500/30 to-orange-500/30 blur-3xl transition-all duration-500" />

        {/* 头像容器 - 星球 */}
        <div className="relative w-full h-full rounded-full overflow-hidden transition-all duration-500">
          <Image
            src="/avatar.jpg"
            alt="头像"
            className="object-cover"
            fill
            sizes="(max-width: 640px) 12rem, (max-width: 768px) 14rem, 18rem"
            priority
          />
        </div>

        {/* 轨道线圈 - 单独渲染以确保可见 */}
        {ability.map((category, i) => (
          <svg 
            key={`orbit-path-${category.name}`}
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            <title>轨道路径 - {category.name}</title>
            <circle
              className="stroke-base-content/30 stroke-[1.5px]"
              cx="50%"
              cy="50%"
              r={getRadius(category.name)}
              fill="none"
            />
          </svg>
        ))}

        {/* 环绕的技术栈图标 */}
        {allTechIcons.map((tech, index) => {
          const radius = getRadius(tech.category);
          const duration = 20 + index % 5 * 3;
          const delay = index * 0.5;

          return (
            <Orbit
              key={`tech-${tech.name}`}
              radius={radius}
              duration={duration}
              delay={delay}
              direction={direction}
              showPath={false}
            >
              <div
                className="w-8 h-8 -ml-4 -mt-4 bg-base-100/80 backdrop-blur-sm rounded-lg shadow-lg flex items-center justify-center cursor-pointer hover:scale-125 hover:bg-primary/10 transition-all duration-300"
                title={tech.name}
              >
                <i className={`${tech.icon} text-lg`} />
              </div>
            </Orbit>
          );
        })}

        {/* 方向控制按钮 - 悬浮显示 */}
        <button
          type="button"
          onClick={switchDirection}
          className="absolute bottom-0 right-0 p-2 bg-base-300/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          title={`切换方向: ${direction === ORBIT_DIRECTION.Clockwise ? "逆时针" : "顺时针"}`}
        >
          <i className={`i-tabler-${direction === ORBIT_DIRECTION.Clockwise ? "refresh" : "rotate-clockwise"} text-base-content`} />
        </button>
      </div>
    </>
  );
}
