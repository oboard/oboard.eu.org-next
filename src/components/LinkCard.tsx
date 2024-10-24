"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import NightToggle from "./NightToggle";
import { motion, AnimateSharedLayout, AnimatePresence } from "framer-motion";

const routes = [
  {
    name: "首页",
    path: "/",
    icon: "i-tabler-home",
  },
  {
    name: "聊天",
    path: "/chat",
    icon: "i-tabler-message",
  },
  {
    name: "GPT",
    path: "/gpt",
    icon: "i-tabler-robot",
  },
  {
    name: "工具",
    path: "/tools",
    icon: "i-tabler-tools",
  },
  {
    name: "关于",
    path: "/about",
    icon: "i-tabler-info-circle",
  },
];

const paths = routes.map((route) => route.path);

export default function LinkCard() {
  const router = useRouter();
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // 检查颜色模式
    const checkColorScheme = () => {
      // 根据系统主题切换浅色和深色模式
      // 使用daisyUI
      const html = document.querySelector("html");
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setIsDark(true);
        html?.setAttribute("data-theme", "night");
      } else {
        setIsDark(false);
        html?.setAttribute("data-theme", "winter");
      }
    };

    checkColorScheme();

    // 当系统颜色发生变化
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        checkColorScheme();
      });
  }, []);

  return (
    <>
      <div className="fixed right-4 top-10 z-100">
        <NightToggle
          value={isDark}
          onChange={(e) => {
            console.log(e);
            const html = document.querySelector("html");
            setIsDark(e.target.checked);
            if (e.target.checked) {
              html?.setAttribute("data-theme", "night");
            } else {
              html?.setAttribute("data-theme", "winter");
            }
          }}
        />
      </div>

      {/* 移动端 */}
      <ul
        style={{
          backgroundColor:
            "var(--fallback-b2,oklch(var(--b2) / var(--un-bg-opacity)))",
        }}
        className="md:hidden fixed bottom-0 left-0 right-0 h-16 flex flex-row backdrop-blur bg-opacity-50 gap-1 px-1 sm:px-2"
      >
        {routes.map((route) => (
          <li
            key={route.path}
            className="flex-1 m-auto h-full py-1 sm:py-2 hoverable"
          >
            <Link
              className={`transition-all active:scale-90 hover:text-primary rounded-full flex flex-col sm:flex-row justify-center items-center ${pathname === route.path ? "text-primary" : ""
                }`}
              href={route.path}
            >
              <i className={`${route.icon} text-xl`} />
              <div>{route.name}</div>
            </Link>
          </li>
        ))}
      </ul>

      {/* 桌面端 */}

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="flex-row items-center px-1 hidden md:flex z-100 fixed top-10 backdrop-blur bg-base-200 bg-opacity-50 ring-1 ring-base-100 ring-opacity-50 rounded-full shadow"
        layout
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      >
        {/* {pathname} */}
        {pathname === "/" ? (
          <div className="w-2" />
        ) : (
          <button
            type="button"
            className="btn btn-ghost btn-sm rounded-full"
            onClick={() => router.back()}
          >
            <i className="i-tabler-arrow-left" />
          </button>
        )}

        <AnimatePresence>
          <ol className="flex flex-row items-center gap-2 pr-2">
            {routes.map((route) => (
              <motion.li
                animate
                key={route.path}
                whileHover={{
                  opacity: 0.8,
                }}
                whileTap={{ scale: 0.9, opacity: 0.6 }}
              >
                <Link
                  className={`relative hoverable block py-2 px-3 font-medium text-sm hover:text-primary transition-colors ${pathname === route.path ? "text-primary" : ""
                    }`}
                  href={route.path}
                >
                  {route.name}
                  <span className="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-primary/0 via-primary/40 dark:via-primary/60 to-primary/0 transition-opacity opacity-0" />

                  {pathname === route.path && (
                    <motion.div
                      layoutId="underline"
                      className="absolute bottom--0.5 left-1 right-1 bg-gradient-to-r from-primary/0 via-primary/40 h-0.5 rounded-full "
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              </motion.li>
            ))}
          </ol>
        </AnimatePresence>
      </motion.div>
    </>
  );
}
