/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// app/lib/storyClient.ts
import { StoryClient, type StoryConfig } from "@story-protocol/core-sdk";
import { createWalletClient, createPublicClient, custom, http, Address } from "viem";

// Story Protocol Aeneid Testnet configuration  
const aeneidTestnet = {
  id: 0x523,  // 1315
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

// Export public client
export const publicClient = createPublicClient({
  chain: aeneidTestnet,
  transport: http(aeneidTestnet.rpcUrls.default.http[0]),
});

export const getStoryClient = async () => {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask not found. Please install MetaMask.");
  }

  try {
    console.log("Requesting MetaMask accounts...");
    
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found. Please connect your MetaMask wallet.");
    }

    const accountAddress = accounts[0] as Address;
    console.log("Connected account:", accountAddress);

    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    const currentChainId = parseInt(chainId, 16);
    console.log("Current chain ID:", currentChainId);
    
    if (currentChainId !== 0x523) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x523' }],
        });
        console.log("Switched to Aeneid testnet");
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x523',
                chainName: 'Story Aeneid Testnet',
                nativeCurrency: {
                  name: 'IP',
                  symbol: 'IP',
                  decimals: 18,
                },
                rpcUrls: ['https://aeneid.storyrpc.io/'],
                blockExplorerUrls: ['https://aeneid.explorer.story.foundation'],
              }],
            });
            console.log("Added Aeneid testnet to MetaMask");
          } catch (addError) {
            throw new Error("Failed to add Aeneid testnet to MetaMask");
          }
        } else {
          throw new Error(`Failed to switch to Aeneid testnet: ${switchError.message}`);
        }
      }
    }

    const walletClient = createWalletClient({
      account: accountAddress,
      chain: aeneidTestnet,
      transport: custom(window.ethereum),
    });

    console.log("Wallet client created successfully");

    if (!walletClient.account) {
      throw new Error("Wallet account is not properly initialized");
    }

    const rpcTransport = http("https://aeneid.storyrpc.io/");

    const config: StoryConfig = {
      account: walletClient.account,
      transport: rpcTransport,
    };

    console.log("Creating Story client with config:", {
      account: config.account.address,
      hasTransport: !!config.transport
    });

    const client = StoryClient.newClient(config);
    
    if (!client) {
      throw new Error("Failed to create Story client");
    }

    console.log("Story client created successfully");

    return {
      client,
      address: accountAddress,
      walletClient,
    };
    
  } catch (error: any) {
    console.error("Error in getStoryClient:", error);
    
    if (error?.message?.includes('chain')) {
      throw new Error("Network error: Please make sure you're connected to Aeneid Testnet");
    } else if (error?.message?.includes('accounts')) {
      throw new Error("Please connect your MetaMask wallet");
    } else if (error?.message?.includes('user rejected')) {
      throw new Error("Connection rejected by user");
    } else {
      throw new Error(`Story client initialization failed: ${error?.message || error}`);
    }
  }
};
