"use client";
import Image from "next/image";
import { ability } from "@/config";
import { motion } from "framer-motion";

export default function InterestingAvatar() {
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
    switch(category) {
      case 'Web': return '120%';
      case 'App': return '160%';
      case 'AI': return '200%';
      case 'Design': return '240%';
      default: return '180%';
    }
  };

  return (
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

      {/* 轨道 */}
      {ability.map((category, i) => (
        <div
          key={category.name}
          className="absolute rounded-full border border-base-content/5"
          style={{
            inset: `-${(i + 1) * 20}%`,
            animation: `spin ${15 + i * 5}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`
          }}
        />
      ))}

      {/* 环绕的技术栈图标
      {allTechIcons.map((tech, index) => {
        const radius = getRadius(tech.category);
        const orbitDuration = 20 + Math.random() * 10;
        const startRotation = Math.random() * 360;
        
        return (
          <motion.div
            key={tech.name}
            className="absolute left-1/2 top-1/2"
            initial={{ opacity: 0, scale: 0, rotate: startRotation }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              rotate: startRotation + 360
            }}
            transition={{ 
              duration: orbitDuration,
              repeat: Infinity,
              ease: "linear",
              delay: index * 0.2
            }}
            style={{
              width: '2rem',
              height: '2rem',
              x: '-50%',
              y: '-50%',
              transformOrigin: `50% ${radius}`
            }}
          >
            <motion.div
              className="w-full h-full bg-base-100/80 backdrop-blur-sm rounded-lg shadow-lg 
                flex items-center justify-center cursor-pointer
                hover:scale-125 hover:bg-primary/10 transition-all duration-300"
              animate={{ 
                rotate: -startRotation - 360
              }}
              transition={{
                duration: orbitDuration,
                repeat: Infinity,
                ease: "linear"
              }}
              whileHover={{ scale: 1.4 }}
            >
              <i className={`${tech.icon} text-lg`} />
            </motion.div>
          </motion.div>
        );
      })} */}
    </div>
  );
}
