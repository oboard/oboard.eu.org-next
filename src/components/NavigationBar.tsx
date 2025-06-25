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
  // 检查颜色模式

  const applyTheme = useCallback((dark: boolean) => {
    const html = document.querySelector('html');
    setIsDark(dark);
    html?.setAttribute('data-theme', dark ? 'night' : 'winter');
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
          <NightToggle
            value={isDark}
            onChange={(e) => {
              applyTheme(e.target.checked);
            }}
          />
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
              <i className="i-tabler-arrow-left" />
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
                    className={`relative hoverable block py-2 px-3 font-medium text-md hover:text-primary transition-colors ${
                      pathname === route.path ? 'text-primary' : ''
                    }`}
                    href={route.path}
                  >
                    {route.name}
                    <span className="absolute inset-x-1 -bottom-px h-px bg-linear-to-r from-primary/0 via-primary/40 dark:via-primary/60 to-primary/0 transition-opacity opacity-0" />

                    {pathname === route.path && (
                      <motion.div
                        layoutId="underline"
                        className="absolute bottom--0.5 mt-1 left-1 right-1 bg-linear-to-r from-primary/0 via-primary/40 h-0.5 rounded-full "
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

      {/* 移动端 */}
      <ul className="md:hidden fixed bottom-0 left-0 right-0 h-16 flex flex-row items-center justify-around bg-base-200/80 backdrop-blur-md px-2 z-50">
        {routes.map((route) => (
          <li key={route.path} className="relative flex-1">
            <Link
              className={`group flex flex-col items-center justify-center py-1 transition-all ${
                pathname === route.path ? 'text-primary' : 'text-base-content/70'
              }`}
              href={route.path}
            >
              <i
                className={`${route.icon} text-xl mb-0.5 transition-transform group-active:scale-90`}
              />
              <span className="text-xs font-medium">{route.name}</span>

              {pathname === route.path && (
                <motion.div
                  layoutId="mobile-nav-indicator"
                  className="absolute -top-1 w-1 h-1 rounded-full bg-primary"
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                  }}
                />
              )}
            </Link>
          </li>
        ))}
      </ul>

      {/* 桌面端 */}
    </>
  );
}
