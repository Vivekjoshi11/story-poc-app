// wagmi.ts
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

const aeneidTestnet = {
  id: 0x523, // 1315
  name: 'Story Aeneid Testnet',  
  network: 'aeneid-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'IP',  
    symbol: 'IP',  
  },
  rpcUrls: {
    public: { http: ['https://aeneid.storyrpc.io/'] },
    default: { http: ['https://aeneid.storyrpc.io/'] },
  },
  blockExplorers: {
    default: { name: 'Aeneid Explorer', url: 'https://aeneid.explorer.story.foundation' },
  },
} as const;

export const config = getDefaultConfig({
  appName: 'story_poc',
  projectId: '34b8e058e7322b57f03349ec6a1ed96a', 
  chains: [aeneidTestnet, sepolia], 
  ssr: true,
});