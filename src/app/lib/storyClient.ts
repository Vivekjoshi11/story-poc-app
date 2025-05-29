// app/lib/storyClient.ts
import { StoryClient, type StoryConfig } from "@story-protocol/core-sdk";
import { createWalletClient, custom, http, Address, Account } from "viem";

// Story Protocol Aeneid Testnet configuration  
const aeneidTestnet = {
  id: 0x523,  // 1315
  name: 'Story Aeneid Testnet',
  network: 'aeneid-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'IP',  // Updated to match MetaMask
    symbol: 'IP',  // Updated to match MetaMask
  },
  rpcUrls: {
    public: { http: ['https://aeneid.storyrpc.io/'] },
    default: { http: ['https://aeneid.storyrpc.io/'] },
  },
  blockExplorers: {
    default: { name: 'Aeneid Explorer', url: 'https://aeneid.explorer.story.foundation' },
  },
} as const;

export const getStoryClient = async () => {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask not found. Please install MetaMask.");
  }

  try {
    console.log("Requesting MetaMask accounts...");
    
    // Request account access
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found. Please connect your MetaMask wallet.");
    }

    const accountAddress = accounts[0];
    console.log("Connected account:", accountAddress);

    // Check if we're on the correct network
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    const currentChainId = parseInt(chainId, 16);
    
    console.log("Current chain ID:", currentChainId);
    
    if (currentChainId !== 0x523) {
      throw new Error(`Wrong network. Please switch to Aeneid Testnet (Chain ID: 1315). Current: ${currentChainId}`);
    }

    // Create wallet client for Story Protocol Aeneid testnet
    // const walletClient = createWalletClient({
    //   account: accountAddress as Address,
    //   chain: aeneidTestnet,
    //   transport: custom(window.ethereum),
    // });
    const account: Account = {
  address: accountAddress as Address,
  type: "json-rpc", // Required for MetaMask
};

const walletClient = createWalletClient({
  account,
  chain: aeneidTestnet,
  transport: custom(window.ethereum),
});


    console.log("Wallet client created successfully");

    // Story Protocol RPC
    const rpcTransport = http("https://aeneid.storyrpc.io/");

    const config: StoryConfig = {
      account: walletClient.account,
      transport: rpcTransport,
    };

    if (!config.account) {
      throw new Error("Wallet account is undefined");
    }

    if (!config.account.address) {
      throw new Error("Wallet address is undefined");
    }

    console.log("Creating Story client with config:", {
      account: config.account.address,
      hasTransport: !!config.transport
    });

    // Create Story client
    const client = await StoryClient.newClient(config);
    
    if (!client) {
      throw new Error("Failed to create Story client");
    }

    console.log("Story client created successfully");

    return {
      client,
      address: accountAddress as `0x${string}`,
    };
    
  } catch (error) {
    console.error("Error in getStoryClient:", error);
    
    // Enhanced error handling
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