/* eslint-disable @typescript-eslint/no-explicit-any */

import { aeneid, mainnet, StoryClient, StoryConfig } from '@story-protocol/core-sdk';
import { Chain, createPublicClient, http } from 'viem';

// Network configuration types
type NetworkType = 'aeneid' | 'mainnet';

interface NetworkConfig {
  rpcProviderUrl: string;
  blockExplorer: string;
  protocolExplorer: string;
  defaultNFTContractAddress: `0x${string}` | null;
  defaultSPGNFTContractAddress: `0x${string}` | null;
  chain: Chain;
}

// Network configurations
const networkConfigs: Record<NetworkType, NetworkConfig> = {
  aeneid: {
    rpcProviderUrl: 'https://aeneid.storyrpc.io',
    blockExplorer: 'https://aeneid.storyscan.io',
    protocolExplorer: 'https://aeneid.explorer.story.foundation',
    defaultNFTContractAddress: '0x937bef10ba6fb941ed84b8d249abc76031429a9a',
    defaultSPGNFTContractAddress: '0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc',
    chain: aeneid,
  },
  mainnet: {
    rpcProviderUrl: 'https://mainnet.storyrpc.io',
    blockExplorer: 'https://storyscan.io',
    protocolExplorer: 'https://explorer.story.foundation',
    defaultNFTContractAddress: null,
    defaultSPGNFTContractAddress: '0x98971c660ac20880b60F86Cc3113eBd979eb3aAE',
    chain: mainnet,
  },
} as const;

// Helper functions
const getNetwork = (): NetworkType => {
  const network = process.env.STORY_NETWORK as NetworkType;
  if (network && !(network in networkConfigs)) {
    throw new Error(`Invalid network: ${network}. Must be one of: ${Object.keys(networkConfigs).join(', ')}`);
  }
  return network || 'aeneid';
}

// Initialize client configuration
export const network = getNetwork();
export const networkInfo = {
  ...networkConfigs[network],
  rpcProviderUrl: process.env.RPC_PROVIDER_URL || networkConfigs[network].rpcProviderUrl,
};

const baseConfig = {
  chain: networkInfo.chain,
  transport: http(networkInfo.rpcProviderUrl),
} as const;

export const publicClient = createPublicClient(baseConfig);

// StoryClient will be initialized per request with the wallet client
export const createStoryClient = (walletClient: any): StoryClient => {
  const config: StoryConfig = {
    wallet: walletClient,
    transport: http(networkInfo.rpcProviderUrl),
    chainId: network,
  };
  return StoryClient.newClient(config);
};

// Export additional useful constants
export const PROTOCOL_EXPLORER = networkInfo.protocolExplorer;
export const SPGNFTContractAddress = networkInfo.defaultSPGNFTContractAddress;