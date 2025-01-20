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
    description: 'AppKit Example',
    url: 'https://oboard.eu.org',
    icons: ['https://oboard.eu.org/favicon.ico']
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
    networks: [crossbell],
    projectId,
    metadata,
    features: {
        analytics: true
    }
}) 