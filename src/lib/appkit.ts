'use client';

import { createAppKit } from '@reown/appkit/react';
import { mainnet } from '@reown/appkit/networks';
import { QueryClient } from '@tanstack/react-query';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';

export const queryClient = new QueryClient();

const projectId = 'c728bad560b63a6cfcb7fc44e645bc2a';
const metadata = {
  name: 'oboard',
  description: 'oboard website',
  url: 'https://www.oboard.fun',
  icons: ['https://www.oboard.fun/avatar3.jpg'],
};

export const networks = [mainnet] as [typeof mainnet];

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
});

export const appkit = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true,
  },
});
