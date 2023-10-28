"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect } from "react";

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
    name: "工具箱",
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

  useEffect(() => {
    // 检查颜色模式
    let checkColorScheme = () => {
      // 根据系统主题切换浅色和深色模式
      // 使用daisyUI
      const html = document.querySelector("html");
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        html?.setAttribute("data-theme", "night");
      } else {
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
      <ul className="md:hidden fixed bottom-0 left-0 right-0 menu h-16 menu-lg menu-horizontal bg-base-200 gap-2">
        {routes.map((route) => (
          <li key={route.path} className="flex-1">
            <Link
              className={`flex flex-row justify-center menu-item ${
                pathname === route.path ? "active" : ""
              }`}
              href={route.path}
            >
              <i className={route.icon}></i>
              <div className="hidden sm:block">{route.name}</div>
            </Link>
          </li>
        ))}
        {/* <li>
          <Link href={""}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Inbox
            <span className="badge badge-sm">99+</span>
          </Link>
        </li> */}
      </ul>

      <ul className="hidden md:flex fixed top-10 group items-center ring-1 ring-zinc-900/5 dark:ring-zinc-100/10 rounded-full bg-gradient-to-b from-zinc-50/70 to-white/70 dark:from-zinc-900/70 dark:to-zinc-800/70 backdrop-blur backdrop-saturate-200 shadow-lg shadow-zinc-800/5">
        <div
          className="pointer-events-none absolute -inset-px rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-primary/[0.12]"
          style={{
            background:
              "radial-gradient(99.4481px at 220px 8px, primary 0%, transparent 65%)",
          }}
          aria-hidden="true"
        ></div>
        <div className="flex flex-row items-center gap-2 transition-width">
          {/* {pathname} */}
          {pathname == "/" ? (
            <div className="w-2" />
          ) : (
            <button
              className="btn btn-ghost btn-sm rounded-full"
              onClick={() => router.back()}
            >
              <i className="i-tabler-arrow-left"></i>
            </button>
          )}

          <div className="flex flex-row items-center gap-2 pr-2">
            {routes.map((route) => (
              <li key={route.path}>
                <Link
                  className={`relative hoverable block py-2 px-3 font-medium text-sm hover:text-primary transition-colors ${
                    pathname === route.path ? "text-primary" : ""
                  }`}
                  href={route.path}
                >
                  {route.name}
                  <span className="absolute inset-x-1 -bottom-px h-px bg-gradient-to-r from-primary/0 via-primary/40 dark:via-primary/60 to-primary/0 transition-opacity opacity-0"></span>
                </Link>
              </li>
            ))}
          </div>
        </div>
      </ul>
    </>
  );
}
