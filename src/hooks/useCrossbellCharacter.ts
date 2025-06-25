"use client";

import useSWR from 'swr'

export interface CrossbellCharacter {
    characterId: number
    handle: string
    primary: boolean
    uri: string
    socialToken: string
    operator: string
    owner: string
    fromAddress: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
    transactionHash: string
    blockNumber: number
    logIndex: number
    updatedTransactionHash: string
    updatedBlockNumber: number
    updatedLogIndex: number
    metadata: {
        uri: string
        type: string
        content: {
            attributes: Array<{
                trait_type: string
                value: string | boolean | number
            }>
            avatars: string[]
            banners: string[]
            bio: string
            connected_accounts: string[]
            name: string
            type: string
        }
        status: string
    }
}

interface CrossbellIndexerResponse {
    list: CrossbellCharacter[]
    count: number
    cursor: string | null
}

const fetcher = async (url: string) => {
    const res = await fetch(url)
    const data: CrossbellIndexerResponse = await res.json()
    return data.list[0] || null
}

export function useCrossbellCharacter(address: string | undefined) {
    const { data } = useSWR(
        address ? `https://indexer.crossbell.io/v1/addresses/${address}/characters?limit=1&primary=true` : null,
        fetcher,
        {
            revalidateOnFocus: false, // 当页面重新获得焦点时不重新验证
            revalidateOnReconnect: false, // 重新连接时不重新验证
            refreshInterval: 0, // 禁用自动刷新
            dedupingInterval: 1000 * 60 * 60, // 1小时内的重复请求会被去重
        }
    )

    return data
} 