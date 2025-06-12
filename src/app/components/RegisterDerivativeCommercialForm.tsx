/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount, useWalletClient } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { createStoryClient, networkInfo } from '../lib/config';
import { StoryClient } from '@story-protocol/core-sdk';
import { Address, toHex } from 'viem';
import { SPGNFTContractAddress } from '../lib/utils';

// Constants
const PARENT_IP_ID: Address = '0x641E638e8FCA4d4844F509630B34c9D524d40BE5';
const PARENT_LICENSE_TERMS_ID: string = '96';

export default function RegisterDerivativeNonCommercial() {
  const [formData, setFormData] = useState({
    ipTitle: '',
    ipDescription: '',
    creatorName: '',
    creatorAddress: '',
    imageUrl: '',
    mediaUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Wagmi hooks
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      // Fetch metadata and IPFS hashes from the server
      const response = await fetch('/api/registerDerivativeNonCommercial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          creatorAddress: address,
          walletAddress: address,
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
      const txResponse = await client.ipAsset.mintAndRegisterIpAndMakeDerivative({
        spgNftContract: SPGNFTContractAddress,
        derivData: {
          parentIpIds: [PARENT_IP_ID],
          licenseTermsIds: [PARENT_LICENSE_TERMS_ID],
        },
        ipMetadata: {
          ipMetadataURI: data.ipMetadataURI,
          ipMetadataHash: data.ipMetadataHash,
          nftMetadataURI: data.nftMetadataURI,
          nftMetadataHash: data.nftMetadataHash,
        },
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
            ipId: txResponse.ipId,
            explorerUrl: `${networkInfo.protocolExplorer}/ipa/${txResponse.ipId}`,
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

  // Auto-update creator address when wallet connects
  useEffect(() => {
    if (address && isConnected) {
      setFormData(prev => ({ ...prev, creatorAddress: address }));
    }
  }, [address, isConnected]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Register Derivative IP Asset</h1>

      <div className="mb-6">
        <ConnectButton />
        {isConnected && address && (
          <p className="text-sm text-gray-600 mt-2">Connected: {address}</p>
        )}
      </div>

      {!isConnected && (
        <div className="mb-4 p-4 bg-yellow-100 rounded">
          <p className="text-yellow-800">Please connect your wallet to register a derivative IP asset.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">IP Title</label>
          <input
            type="text"
            name="ipTitle"
            value={formData.ipTitle}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter IP Title"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">IP Description</label>
          <textarea
            name="ipDescription"
            value={formData.ipDescription}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter IP Description"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Creator Name</label>
          <input
            type="text"
            name="creatorName"
            value={formData.creatorName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter Creator Name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Creator Address</label>
          <input
            type="text"
            name="creatorAddress"
            value={formData.creatorAddress}
            className="w-full p-2 border rounded bg-gray-100"
            readOnly
            title="This will be automatically set to your connected wallet address"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            This will be automatically set to your connected wallet address
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium">Image URL</label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter Image URL"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Media URL</label>
          <input
            type="url"
            name="mediaUrl"
            value={formData.mediaUrl}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter Media URL"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading || !isConnected}
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Registering...' : 'Register Derivative'}
        </button>
      </form>
      {result && (
        <div className="mt-4 p-4 bg-green-100 rounded text-black">
          <h2 className="text-lg font-semibold text-black">Success!</h2>
          <p>Transaction Hash: {result.txHash}</p>
          <p>IP ID: {result.ipId}</p>
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
        <div className="mt-4 p-4 bg-red-100 rounded text-black">
          <h2 className="text-lg font-semibold text-black">Error</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}