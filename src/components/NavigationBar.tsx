'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import NightToggle from './NightToggle';
import { motion, AnimatePresence } from 'framer-motion';
import ConnectWalletButton from '@/components/ConnectWalletButton';
import { appkit } from '@/lib/appkit';
import { Button } from '@headlessui/react';

const routes = [
  {
    name: '首页',
    path: '/',
    icon: 'i-tabler-home',
  },
  {
    name: '聊天',
    path: '/chat',
    icon: 'i-tabler-message',
  },
  {
    name: 'GPT',
    path: '/gpt',
    icon: 'i-tabler-robot',
  },
  {
    name: '作品集',
    path: '/tools',
    icon: 'i-tabler-tools',
  },
  {
    name: '关于',
    path: '/about',
    icon: 'i-tabler-info-circle',
  },
];

export default function NavigationBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // 检查颜色模式

  const applyTheme = useCallback((dark: boolean) => {
    const html = document.querySelector('html');
    setIsDark(dark);
    html?.setAttribute('data-theme', dark ? 'night' : 'pastel');
    appkit.setThemeMode(dark ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    const checkColorScheme = () => {
      applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches);
    };
    checkColorScheme();

    // 当系统颜色发生变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      checkColorScheme();
    });
  }, [applyTheme]);

  return (
    <>
      <div className="fixed left-4 right-4 top-5 z-100 flex flex-row items-center justify-between gap-2">
        <div className="w-48 flex justify-start">
          {/* 移动端菜单按钮 */}
          <Button
            type="button"
            className="btn btn-lg rounded-full md:hidden"
            onClick={() => setIsDrawerOpen(true)}
          >
            <i className="i-tabler-menu-2 text-lg" />
            菜单
          </Button>

          {/* 桌面端夜间模式切换 */}
          <div className="hidden md:block">
            <NightToggle
              value={isDark}
              onChange={(e) => {
                applyTheme(e.target.checked);
              }}
            />
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex-row items-center px-2 hidden md:flex backdrop-blur bg-base-200 bg-opacity-50 ring-1 ring-base-300 ring-opacity-50 rounded-full"
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
        >
          {/* {pathname} */}
          {pathname === '/' ? (
            <div className="w-2" />
          ) : (
            <Button
              type="button"
              className="btn btn-ghost btn-sm rounded-full"
              onClick={() => router.back()}
            >
              <i className="i-tabler-arrow-left text-lg" />
            </Button>
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
                    className={`relative hoverable block py-2 px-3 font-medium text-md hover:text-primary-content transition-colors ${pathname === route.path ? 'text-primary-content' : ''
                      }`}
                    href={route.path}
                  >
                    {route.name}
                    <span className="absolute inset-x-1 -bottom-px h-px bg-linear-to-r from-primary/0 via-primary dark:via-primary/60 to-primary/0 transition-opacity opacity-0" />

                    {pathname === route.path && (
                      <motion.div
                        layoutId="underline"
                        className="absolute bottom--0.5 mt-1 left-1 right-1 bg-linear-to-r from-primary/0 via-primary h-0.5 rounded-full "
                        transition={{
                          type: 'spring',
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
        <div className="w-48 flex justify-end">
          <ConnectWalletButton />
        </div>
      </div>

      {/* 移动端抽屉菜单 */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* 背景遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-200 md:hidden"
              onClick={() => setIsDrawerOpen(false)}
            />

            {/* 抽屉内容 */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-base-100 shadow-2xl z-300 md:hidden"
            >
              {/* 抽屉头部 */}
              <div className="flex items-center justify-between p-6 border-b border-base-300">
                <h2 className="text-xl font-bold text-base-content">菜单</h2>
                <Button
                  type="button"
                  className="btn btn-ghost btn-sm rounded-full"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  <i className="i-tabler-x text-lg" />
                </Button>
              </div>

              {/* 导航菜单 */}
              <nav className="p-4">
                <ul className="space-y-2">
                  {routes.map((route) => (
                    <motion.li
                      key={route.path}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        className={`flex items-center gap-4 p-3 rounded-lg transition-all ${pathname === route.path
                          ? 'bg-primary text-primary-content shadow-md'
                          : 'hover:bg-base-200 text-base-content'
                          }`}
                        href={route.path}
                        onClick={() => setIsDrawerOpen(false)}
                      >
                        <i className={`${route.icon} text-xl`} />
                        <span className="font-medium">{route.name}</span>
                        {pathname === route.path && (
                          <motion.div
                            layoutId="drawer-indicator"
                            className="ml-auto w-2 h-2 rounded-full bg-primary-content"
                            transition={{
                              type: 'spring',
                              stiffness: 300,
                              damping: 30,
                            }}
                          />
                        )}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* 抽屉底部 - 夜间模式切换和钱包连接 */}
              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-base-300 space-y-4">
                {/* 夜间模式切换 */}
                <div className="flex items-center justify-between">
                  <span className="text-base-content font-medium">夜间模式</span>
                  <NightToggle
                    value={isDark}
                    onChange={(e) => {
                      applyTheme(e.target.checked);
                    }}
                  />
                </div>

                {/* 钱包连接 */}
                <div className="w-full">
                  <ConnectWalletButton />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 桌面端 */}
    </>
  );
}
