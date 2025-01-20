"use client";

import { useEffect, useState } from 'react'


interface CrossbellCharacter {
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

export function useCrossbellCharacter(address: string | undefined) {
    const [data, setData] = useState<CrossbellCharacter | null>(null)

    useEffect(() => {
        if (!address) return

        fetch(`https://indexer.crossbell.io/v1/addresses/${address}/characters?limit=1&primary=true`)
            .then(res => res.json())
            .then((res: CrossbellIndexerResponse) => setData(res.list[0]))
    }, [address])

    return data
} 