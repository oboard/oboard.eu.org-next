"use client";

import '@reown/appkit/react'
import { useAccount, useDisconnect } from 'wagmi';
import { useCrossbellCharacter } from '@/hooks/useCrossbellCharacter';
import Image from 'next/image';
import { getCrossbellImageUrl } from '@/utils/crossbell'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConnectWalletButton() {
    const { address } = useAccount()
    const character = useCrossbellCharacter(address)
    const { disconnect } = useDisconnect()
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    if (address && character) {
        return (
            <div className="relative">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex flex-row items-center gap-2 text-sm leading-5 border border-base-300 bg-base-200 bg-opacity-80 backdrop-blur-sm rounded-full px-1 py-1 hover:bg-base-300/80 transition-colors"
                >
                    <Image
                        className='rounded-full overflow-clip'
                        src={getCrossbellImageUrl(character.metadata.content.avatars[0])}
                        alt="avatar"
                        width={32}
                        height={32}
                    />
                    <span className='flex-1 overflow-hidden text-ellipsis whitespace-nowrap'>
                        {character.metadata.content.name}
                    </span>
                    <i className={`i-tabler-chevron-down p-2 mr-2 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                    {isMenuOpen && (
                        <>
                            {/* 点击外部关闭菜单 */}
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setIsMenuOpen(false)}
                            />

                            {/* 下拉菜单 */}
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute right-0 mt-2 w-48 rounded-xl border border-base-300 bg-base-200 bg-opacity-80 backdrop-blur-sm shadow-lg z-50"
                            >
                                <div className="p-2">
                                    <button
                                        onClick={() => {
                                            disconnect();
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-base-content/80 hover:text-error rounded-lg hover:bg-base-300/50 transition-colors"
                                    >
                                        <i className="i-tabler-logout" />
                                        断开连接
                                    </button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        )
    }
    return <appkit-connect-button label='连接' />
} 