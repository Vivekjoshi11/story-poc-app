/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount, useWalletClient } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { createStoryClient, networkInfo } from '../lib/config';
import { Address } from 'viem';

export default function TransferRoyaltyForm() {
  const [formData, setFormData] = useState({
    ipId: '',
    royaltyPercent: '1',
    targetAddress: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Wagmi hooks
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected || !address || !walletClient) {
      setError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Fetch transaction data from the server
      const response = await fetch('/api/transfer-royalty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          targetAddress: formData.targetAddress || address, // Default to connected address if not specified
        }),
      });
      const data = await response.json();

      if (!data.success) {
        setError(data.error);
        setLoading(false);
        return;
      }

      // Initialize StoryClient with walletClient
      const client = createStoryClient(walletClient);

      // Perform the transaction client-side
      const txResponse = await client.ipAccount.transferErc20({
        ipId: data.ipId as Address,
        tokens: [data.tokenData],
        txOptions: { 
          waitForTransaction: true,
          wallet: walletClient,
        },
      });

      // Serialize response to handle BigInt
      const serializedResponse = JSON.parse(
        JSON.stringify(
          {
            success: true,
            txHash: txResponse.txHash,
            explorerUrl: `${networkInfo.protocolExplorer}/tx/${txResponse.txHash}`,
          },
          (key, value) => (typeof value === 'bigint' ? value.toString() : value)
        )
      );

      setResult(serializedResponse);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Auto-update target address when wallet connects
  useEffect(() => {
    if (address && isConnected) {
      setFormData(prev => ({ ...prev, targetAddress: address }));
    }
  }, [address, isConnected]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Transfer Royalty Tokens</h1>

      <div className="mb-6">
        <ConnectButton />
        {isConnected && address && (
          <p className="text-sm text-gray-600 mt-2">
            Connected: {address}
          </p>
        )}
      </div>

      {!isConnected && (
        <div className="mb-4 p-4 bg-yellow-100 rounded">
          <p className="text-yellow-800">Please connect your wallet to transfer royalty tokens.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">IP Asset ID</label>
          <input
            type="text"
            name="ipId"
            value={formData.ipId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            placeholder="Enter IP Asset ID"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Royalty Percent</label>
          <input
            type="number"
            name="royaltyPercent"
            value={formData.royaltyPercent}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            min="0"
            max="100"
            step="0.01"
            placeholder="Enter royalty percentage (e.g., 1)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Target Address</label>
          <input
            type="text"
            name="targetAddress"
            value={formData.targetAddress}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            placeholder="Enter target wallet address"
          />
          <p className="text-xs text-gray-500 mt-1">
            Defaults to your connected wallet address if left empty
          </p>
        </div>
        <button
          type="submit"
          disabled={loading || !isConnected}
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Transferring...' : 'Transfer Royalty Tokens'}
        </button>
      </form>
      {result && (
        <div className="mt-4 p-4 bg-green-100 rounded text-black">
          <h2 className="text-lg font-semibold text-black">Success!</h2>
          <p>Transaction Hash: {result.txHash}</p>
          <a
            href={result.explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View on Explorer
          </a>
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-100 rounded text-red-800">
          <h2 className="text-lg font-semibold">Error</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}