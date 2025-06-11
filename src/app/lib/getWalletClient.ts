// lib/getWalletClient.ts
import { getWalletClient } from 'wagmi/actions';
import { config } from './wagmi';

export const getConnectedWalletClient = async () => {
  const walletClient = await getWalletClient(config);
  if (!walletClient) throw new Error("Wallet not connected");
  return walletClient;
};
