"use client";

import { createAppKit } from '@reown/appkit/react'
import { crossbell } from '@reown/appkit/networks'
import { QueryClient } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

// 创建 QueryClient 实例
export const queryClient = new QueryClient()

// AppKit 配置
const projectId = 'c728bad560b63a6cfcb7fc44e645bc2a'
const metadata = {
    name: 'oboard',
    description: 'oboard website',
    url: 'https://www.oboard.fun',
    icons: ['https://www.oboard.fun/avatar3.jpg']
}

// 创建 Wagmi 适配器
export const wagmiAdapter = new WagmiAdapter({
    networks: [crossbell],
    projectId,
    ssr: true
});

// 初始化 AppKit
export const appkit = createAppKit({
    adapters: [wagmiAdapter],
    // @ts-ignore
    networks: [crossbell],
    projectId,
    metadata,
    features: {
        analytics: true
    }
}) 