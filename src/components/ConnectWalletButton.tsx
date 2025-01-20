"use client";

import '@reown/appkit/react'
import { useAccount } from 'wagmi';
import { useCrossbellCharacter } from '@/hooks/useCrossbellCharacter';
import Image from 'next/image';
import { getCrossbellImageUrl } from '@/utils/crossbell'

export default function ConnectWalletButton() {
    const { address } = useAccount()
    const character = useCrossbellCharacter(address)

    if (address && character) {
        return <div className="flex flex-row items-center gap-2 text-sm leading-5 border border-base-300 bg-base-200 bg-opacity-80 backdrop-blur-sm rounded-full px-2 py-1">
            <Image
                className='rounded-full overflow-clip'
                src={getCrossbellImageUrl(character.metadata.content.avatars[0])}
                alt="avatar"
                width={24}
                height={24}
            />
            <span>{character.metadata.content.name}</span>
            {/* 断开连接 */}
            <appkit-account-button balance="hide" />
        </div>
    }
    return <appkit-connect-button label='连接' />
} 