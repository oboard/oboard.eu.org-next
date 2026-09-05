'use client';

import '@reown/appkit/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';

function formatAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function ConnectWalletButton() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (address) {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex flex-row items-center gap-2 text-sm leading-5 border border-base-300 bg-base-200 bg-opacity-80 backdrop-blur-sm rounded-full px-3 py-2 hover:bg-base-300/80 transition-colors"
        >
          <i className="i-logos-ethereum" />
          <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
            {formatAddress(address)}
          </span>
          <i className={`i-tabler-chevron-down p-2 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isMenuOpen && (
            <>
              <button
                type="button"
                aria-label="关闭钱包菜单"
                className="fixed inset-0 z-40 cursor-default"
                onClick={() => setIsMenuOpen(false)}
              />

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 rounded-xl border border-base-300 bg-base-200 bg-opacity-80 backdrop-blur-sm shadow-lg z-50"
              >
                <div className="p-2">
                  <div className="px-4 py-2 text-xs text-base-content/60 break-all">{address}</div>
                  <button
                    type="button"
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
    );
  }

  return <appkit-connect-button label="连接 ETH" />;
}
