// /* eslint-disable @typescript-eslint/no-unused-vars */


import { StoryClient, StoryConfig } from "@story-protocol/core-sdk";
import { createWalletClient, custom, http } from "viem";
import { sepolia } from "viem/chains";

export const getStoryClient = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask not found");
  }

  const [accountAddress] = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  const walletClient = createWalletClient({
    account: accountAddress as `0x${string}`,
    chain: sepolia,
    transport: custom(window.ethereum), // used for signing if needed
  });

  const rpcTransport = http("https://rpc2.sepolia.org"); // or any working Sepolia RPC

  const config: StoryConfig = {
    account: walletClient.account,
    transport: rpcTransport, // NOT custom()
    chainId: 11155111, // ✅ Use raw number, not a type
  };

  return StoryClient.newClient(config);
};
