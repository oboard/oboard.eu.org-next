'use client';
import Image from 'next/image';
import { ability } from '@/config';
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';

// 定义轨道方向常量
const ORBIT_DIRECTION = {
  Clockwise: 'normal',
  CounterClockwise: 'reverse',
} as const;

type OrbitDirection = (typeof ORBIT_DIRECTION)[keyof typeof ORBIT_DIRECTION];

// 轨道线颜色根据类别变化
const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Web':
      return 'rgba(59, 130, 246, 0.2)'; // 蓝色
    case 'App':
      return 'rgba(16, 185, 129, 0.2)'; // 绿色
    case 'AI':
      return 'rgba(236, 72, 153, 0.2)'; // 粉色
    case 'Design':
      return 'rgba(245, 158, 11, 0.2)'; // 黄色
    default:
      return 'rgba(255, 255, 255, 0.2)';
  }
};

// 根据分类分配不同的轨道半径
const getRadius = (category: string) => {
  switch (category) {
    case 'Web':
      return 240;
    case 'App':
      return 320;
    case 'AI':
      return 400;
    case 'Design':
      return 480;
    default:
      return 360;
  }
};

// 添加随机种子函数 - 用于生成稳定的随机数，这样每次渲染结果相同
const seededRandom = (seed: string) => {
  // 简单的字符串哈希函数
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash = hash & hash; // 转换为32位整数
  }

  // 生成0-1之间的随机数
  const x = Math.sin(hash) * 10000;
  return x - Math.floor(x);
};

// Orbit 组件 - 使用memo减少重新渲染
const Orbit = React.memo(
  ({
    children,
    radius,
    duration = 20,
    delay = 10,
    direction = ORBIT_DIRECTION.Clockwise,
    className = '',
    angle = 0, // 添加angle属性，默认为0
  }: {
    children: React.ReactNode;
    radius: number;
    duration?: number;
    delay?: number;
    direction?: OrbitDirection;
    className?: string;
    angle?: number; // 角度属性类型定义
  }) => {
    const orbitRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (orbitRef.current) {
        orbitRef.current.style.setProperty('--radius', `${radius}px`);
        orbitRef.current.style.setProperty('--angle', `${angle}deg`);
      }
    }, [radius, angle]);

    return (
      <div
        ref={orbitRef}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-0 w-0 animate-orbit ${className}`}
        style={{
          animationDirection: direction,
          animationDuration: `${duration}s`,
          animationDelay: `${-delay}s`,
          transform: `rotate(${angle}deg)`, // 应用初始旋转角度
        }}
      >
        {children}
      </div>
    );
  }
);

Orbit.displayName = 'Orbit';

// 定义CSS样式 - 移到组件外部避免重复创建
const globalStyles = `
  @keyframes orbit {
    0% {
      transform: rotate(var(--angle)) translateY(var(--radius)) rotate(calc(-1 * var(--angle)));
    }
    100% {
      transform: rotate(calc(var(--angle) + 360deg)) translateY(var(--radius)) rotate(calc(-1 * var(--angle) - 360deg));
    }
  }
  
  .animate-orbit {
    animation: orbit 20s linear infinite;
    transform-origin: center;
  }
  
  /* 轨道线样式 */
  .orbit-path {
    opacity: 0.8;
    stroke-width: 2px;
    vector-effect: non-scaling-stroke;
  }
  
  /* 确保SVG容器不会被裁剪 */
  .orbit-container {
    overflow: visible !important;
  }
`;

export default function InterestingAvatar() {
  const [direction, setDirection] = useState<OrbitDirection>(ORBIT_DIRECTION.Clockwise);

  // 切换方向函数 - 使用useCallback避免重新创建
  const switchDirection = useCallback(() => {
    setDirection((prev) =>
      prev === ORBIT_DIRECTION.Clockwise
        ? ORBIT_DIRECTION.CounterClockwise
        : ORBIT_DIRECTION.Clockwise
    );
  }, []);

  // 预先计算轨道数据，避免在渲染期间计算
  const orbits = useMemo(
    () =>
      ability.map((category, i) => {
        // 每个类别的基础旋转速度
        const baseDuration = 30 + i * 10;

        return {
          key: category.name,
          radius: getRadius(category.name),
          duration: baseDuration,
          delay: i * 1.5,
          color: getCategoryColor(category.name),
          icons: category.children.map((tech, techIndex) => {
            // 为每个图标生成稳定的随机种子
            const seed = `${category.name}-${tech.name}`;
            const random = seededRandom(seed);

            // 初始角度 - 均匀基础分布 + 随机偏移
            const baseAngle = (360 / category.children.length) * techIndex;
            const angleOffset = random * 30 - 15; // 添加±15度的随机偏移

            // 速度变化 - 基础速度 ± 20%的随机变化
            const speedFactor = 0.8 + random * 0.4; // 0.8-1.2之间的随机因子

            return {
              ...tech,
              angle: baseAngle + angleOffset,
              duration: Math.floor(baseDuration * speedFactor),
              delay: techIndex * 0.5 + random * 2, // 添加0-2秒的随机延迟
            };
          }),
        };
      }),
    []
  );

  // 预先计算所有技术图标，避免每次渲染都flatMap
  const allTechIcons = useMemo(
    () =>
      ability.flatMap((category) => {
        // 每个类别的基础旋转速度
        const baseDuration = 30 + ability.indexOf(category) * 10;

        return category.children.map((tech, techIndex) => {
          // 为每个图标生成稳定的随机种子
          const seed = `${category.name}-${tech.name}`;
          const random = seededRandom(seed);

          // 速度变化 - 基础速度 ± 30%的随机变化
          const speedFactor = 0.7 + random * 0.6; // 0.7-1.3之间的随机因子

          // 计算初始角度 - 均匀分布加随机偏移
          const baseAngle = (360 / category.children.length) * techIndex;
          const angleOffset = random * 30 - 15; // 添加±15度的随机偏移

          return {
            icon: tech.icon,
            name: tech.name,
            category: category.name,
            radius: getRadius(category.name),
            duration: Math.floor(baseDuration * speedFactor),
            delay: category.children.indexOf(tech) * 0.5 + random * 3, // 添加0-3秒的随机延迟
            angle: baseAngle + angleOffset, // 添加角度信息
          };
        });
      }),
    []
  );

  return (
    <>
      {/* 添加 CSS keyframes - 只加载一次 */}
      <style jsx global>
        {globalStyles}
      </style>

      {/* 主容器 */}
      <div className="w-full h-full relative group orbit-container" style={{ overflow: 'visible' }}>
        {/* 光晕效果 */}
        <div className="absolute inset-0 rounded-full bg-linear-to-r from-yellow-500/30 to-orange-500/30 blur-3xl transition-all duration-500" />

        {/* 头像容器 - 星球 */}
        <div className="relative w-full h-full rounded-full overflow-hidden transition-all duration-500">
          <Image
            src="https://obscloud.ulearning.cn/resources/web/1748237070466.png"
            alt="头像"
            className="object-cover"
            fill
            sizes="(max-width: 640px) 12rem, (max-width: 768px) 14rem, 18rem"
            priority
          />
        </div>

        {/* 轨道线圈 */}
        {orbits.map((orbit) => (
          <svg
            key={`orbit-path-${orbit.key}`}
            className="pointer-events-none absolute inset-0 w-full h-full"
            aria-hidden="true"
            style={{
              overflow: 'visible',
              zIndex: 20,
            }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>轨道路径</title>
            <circle
              className="orbit-path"
              cx="50%"
              cy="50%"
              r={orbit.radius}
              fill="none"
              stroke={orbit.color}
              strokeWidth={2}
              strokeDasharray="5,5"
              style={{
                opacity: 1,
                filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.5))',
              }}
            />
          </svg>
        ))}

        {/* 环绕的技术栈图标 */}
        <div className="absolute inset-0 w-full h-full" style={{ overflow: 'visible', zIndex: 30 }}>
          {allTechIcons.map((tech) => (
            <Orbit
              key={`tech-${tech.name}`}
              radius={tech.radius}
              duration={tech.duration}
              delay={tech.delay}
              direction={direction}
              angle={tech.angle}
            >
              <div
                className="w-8 h-8 -ml-4 -mt-4 bg-base-100/80 rounded-lg shadow-lg flex items-center justify-center cursor-pointer hover:scale-125 hover:bg-primary/10 transition-all duration-300"
                title={tech.name}
                style={{ zIndex: 40 }}
              >
                <i className={`${tech.icon} w-5 h-5`} />
              </div>
            </Orbit>
          ))}
        </div>

        {/* 方向控制按钮 */}
        <button
          type="button"
          onClick={switchDirection}
          className="absolute bottom-0 right-0 p-2 bg-base-300/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          title={`切换方向: ${direction === ORBIT_DIRECTION.Clockwise ? '逆时针' : '顺时针'}`}
          style={{ zIndex: 50 }}
        >
          <i
            className={`i-tabler-${direction === ORBIT_DIRECTION.Clockwise ? 'refresh' : 'rotate-clockwise'} text-base-content`}
          />
        </button>
      </div>
    </>
  );
}
