// // wagmi.ts
// import { getDefaultConfig } from '@rainbow-me/rainbowkit';
// import { sepolia } from 'wagmi/chains';

// // Define Story Protocol Aeneid Testnet
// const aeneidTestnet = {
//   id: 1513,
//   name: 'Aeneid Testnet',
//   network: 'aeneid-testnet',
//   nativeCurrency: {
//     decimals: 18,
//     name: 'Aeneid',
//     symbol: 'AEN',
//   },
//   rpcUrls: {
//     public: { http: ['https://rpc.aeneid.story.foundation'] },
//     default: { http: ['https://rpc.aeneid.story.foundation'] },
//   },
//   blockExplorers: {
//     default: { name: 'Aeneid Explorer', url: 'https://aeneid.explorer.story.foundation' },
//   },
// } as const;

// export const config = getDefaultConfig({
//   appName: 'story_poc',
//   projectId: '34b8e058e7322b57f03349ec6a1ed96a', // from https://cloud.walletconnect.com
//   chains: [aeneidTestnet, sepolia], // Include both chains
//   ssr: true,
// });

// wagmi.ts
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

// Define Story Protocol Aeneid Testnet
const aeneidTestnet = {
  id: 0x523, // 1315
  name: 'Story Aeneid Testnet',  // Updated to match MetaMask
  network: 'aeneid-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'IP',  // Changed from 'Aeneid' to 'IP'
    symbol: 'IP',  // Changed from 'AEN' to 'IP'
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
  projectId: '34b8e058e7322b57f03349ec6a1ed96a', // from https://cloud.walletconnect.com
  chains: [aeneidTestnet, sepolia], // Include both chains
  ssr: true,
});