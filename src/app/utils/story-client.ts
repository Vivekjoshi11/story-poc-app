/* eslint-disable @typescript-eslint/no-unused-vars */
// lib/story-client.ts
import { StoryClient, StoryConfig } from '@story-protocol/core-sdk';
import { WalletClient, http, createWalletClient } from 'viem';
import { aeneid, mainnet } from '@story-protocol/core-sdk';
import { privateKeyToAccount } from 'viem/accounts';

// Network configuration
const NETWORKS = {
  aeneid: {
    rpcUrl: 'https://aeneid.storyrpc.io',
    chain: aeneid,
    chainId: 'aeneid' as const,
  },
  mainnet: {
    rpcUrl: 'https://mainnet.storyrpc.io',
    chain: mainnet,
    chainId: 'mainnet' as const,
  },
} as const;

type NetworkType = keyof typeof NETWORKS;

export const createStoryClient = (
  walletClient: WalletClient, 
  network: NetworkType = 'aeneid'
): StoryClient => {
  const networkConfig = NETWORKS[network];
  
  const config: StoryConfig = {
    account: walletClient.account!,
    transport: http(networkConfig.rpcUrl),
    chainId: networkConfig.chainId,
  };

  return StoryClient.newClient(config);
};

// Alternative method using wallet client directly
export const createStoryClientFromWallet = async (
  walletClient: WalletClient,
  network: NetworkType = 'aeneid'
): Promise<StoryClient> => {
  const networkConfig = NETWORKS[network];
  
  // Ensure we have a proper account
  if (!walletClient.account) {
    throw new Error('Wallet client must have an account');
  }

  const config: StoryConfig = {
    account: walletClient.account,
    transport: http(networkConfig.rpcUrl),
    chainId: networkConfig.chainId,
  };

  return StoryClient.newClient(config);
};

export const createCommercialRemixTerms = (params: {
  defaultMintingFee: number;
  commercialRevShare: number;
}) => {
  return {
    defaultMintingFee: BigInt(params.defaultMintingFee),
    commercialRevShare: params.commercialRevShare * 10000, // Convert percentage to basis points
    commercialRevCelling: 0,
    derivativesAllowed: true,
    derivativesAttribution: true,
    derivativesApproval: false,
    derivativesReciprocal: true,
    territoriesAllowed: [],
    distributionChannelsAllowed: [],
    contentRestrictionsAllowed: [],
  };
};

// Contract addresses - adjust based on your network
export const CONTRACT_ADDRESSES = {
  aeneid: {
    SPGNFTContractAddress: '0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc',
    protocolExplorer: 'https://aeneid.explorer.story.foundation',
  },
  mainnet: {
    SPGNFTContractAddress: '0x98971c660ac20880b60F86Cc3113eBd979eb3aAE',
    protocolExplorer: 'https://explorer.story.foundation',
  },
} as const;