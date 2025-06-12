/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount, useWalletClient } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { createStoryClient, networkInfo } from '../lib/config';
import { StoryClient } from '@story-protocol/core-sdk';
import { Address, toHex } from 'viem';
import { SPGNFTContractAddress, NonCommercialSocialRemixingTermsId } from '../lib/utils';

// Constants
const PARENT_IP_ID: Address = '0x641E638e8FCA4d4844F509630B34c9D524d40BE5';

export default function RegisterDerivativeNonCommercial() {
  const [formData, setFormData] = useState({
    ipMetadataURI: 'test-uri',
    ipMetadataHash: 'test-metadata-hash',
    nftMetadataHash: 'test-nft-metadata-hash',
    nftMetadataURI: 'test-nft-uri',
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
      // Validate and prepare data via the server
      const response = await fetch('/api/registerDerivativeNonCommercial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
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

      // Perform the transaction client-side, matching the Node.js script
      const childIp = await client.ipAsset.mintAndRegisterIpAndMakeDerivative({
        spgNftContract: SPGNFTContractAddress,
        derivData: {
          parentIpIds: [PARENT_IP_ID],
          licenseTermsIds: [NonCommercialSocialRemixingTermsId],
        },
        ipMetadata: {
          ipMetadataURI: formData.ipMetadataURI,
          ipMetadataHash: toHex(formData.ipMetadataHash, { size: 32 }),
          nftMetadataURI: formData.nftMetadataURI,
          nftMetadataHash: toHex(formData.nftMetadataHash, { size: 32 }),
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
            transactionHash: childIp.txHash,
            ipaId: childIp.ipId,
            explorerUrl: `${networkInfo.protocolExplorer}/ipa/${childIp.ipId}`,
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
          <label className="block text-sm font-medium">IP Metadata URI</label>
          <input
            type="text"
            name="ipMetadataURI"
            value={formData.ipMetadataURI}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter IP Metadata URI"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">IP Metadata Hash</label>
          <input
            type="text"
            name="ipMetadataHash"
            value={formData.ipMetadataHash}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter IP Metadata Hash"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">NFT Metadata Hash</label>
          <input
            type="text"
            name="nftMetadataHash"
            value={formData.nftMetadataHash}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter NFT Metadata Hash"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">NFT Metadata URI</label>
          <input
            type="text"
            name="nftMetadataURI"
            value={formData.nftMetadataURI}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter NFT Metadata URI"
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
          <p>Transaction Hash: {result.transactionHash}</p>
          <p>IPA ID: {result.ipaId}</p>
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