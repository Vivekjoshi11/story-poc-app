/* eslint-disable @typescript-eslint/no-unused-vars */
// wagmi.ts
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'story_poc',
  projectId: '34b8e058e7322b57f03349ec6a1ed96a', // from https://cloud.walletconnect.com
  chains: [sepolia],
  ssr: true,
});
