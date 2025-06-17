/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount, useWalletClient } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { createStoryClient, networkInfo } from '../lib/config';
import { StoryClient, WIP_TOKEN_ADDRESS } from '@story-protocol/core-sdk';
import { Address, toHex } from 'viem';
import { RoyaltyPolicyLRP } from '../lib/utils';

export default function RegisterCommercialDerivative() {
  const [formData, setFormData] = useState({
    parentIpId: '0xed8F51EF89d88DFf97C4a9Efecc3A25281F608D6',
    licenseTermsId: '1605', // Replace with the actual license terms ID from the parent IP
    title: 'Vivek first derivative',
    description: 'This is a derivative house-style song generated on suno.',
    createdAt: Math.floor(Date.now() / 1000).toString(),
    creatorName: 'Vivek Joshi',
    creatorAddress: '',
    imageUrl: 'https://cdn2.suno.ai/image_large_8bcba6bc-3f60-4921-b148-f32a59086a4c.jpeg',
    imageHash: '0xc404730cdcdf7e5e54e8f16bc6687f97c6578a296f4a21b452d8a6ecabd61bcc',
    mediaUrl: 'https://cdn1.suno.ai/dcd3076f-3aa5-400b-ba5d-87d30f27c311.mp3',
    mediaHash: '0xb52a44f53b2485ba772bd4857a443e1fb942cf5dda73c870e2d2238ecd607aee',
    mediaType: 'audio/mpeg',
    nftName: 'Midnight Marriage Derivative',
    nftDescription: 'This NFT represents a derivative IP Asset of a house-style song from Suno.com.',
    sunoArtist: 'amazedneurofunk956',
    artistId: '4123743b-8ba6-4028-a965-75b79a3ad424',
    mintingFee: '1',
    commercialRevShare: '5',
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

    if (!formData.parentIpId || !formData.licenseTermsId) {
      setError('Parent IP ID and License Terms ID are required');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Fetch metadata and IPFS hashes from the server
      const response = await fetch('/api/register-derivative-commercial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          creatorAddress: address,
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

      // Register the derivative IP Asset using mintAndRegisterIpAndMakeDerivative
      const childIp = await client.ipAsset.mintAndRegisterIpAndMakeDerivative({
        spgNftContract: data.spgNftContract,
        derivData: {
          parentIpIds: [formData.parentIpId as Address],
          licenseTermsIds: [formData.licenseTermsId],
        },
        ipMetadata: {
          ipMetadataURI: data.ipMetadataURI,
          ipMetadataHash: data.ipMetadataHash,
          nftMetadataURI: data.nftMetadataURI,
          nftMetadataHash: data.nftMetadataHash,
        },
        txOptions: {
          wallet: walletClient,
        },
      });

      // Prepare the success response for the derivative registration
      let serializedResponse = {
        success: true,
        txHash: childIp.txHash,
        childIpId: childIp.ipId || 'N/A',
        parentClaimRevenue: null,
        explorerUrl: `${networkInfo.protocolExplorer}/ipa/${childIp.ipId || ''}`,
      };

      // Attempt to claim revenue for the parent IP (optional step)
      try {
        const parentClaimRevenue = await client.royalty.claimAllRevenue({
          ancestorIpId: formData.parentIpId as Address,
          claimer: '0x056c3160301D70f4F8A6e0d8717F8Af3676D1669' as Address, // Parent IP owner address
          childIpIds: [childIp.ipId as Address],
          royaltyPolicies: [RoyaltyPolicyLRP],
          currencyTokens: [WIP_TOKEN_ADDRESS],
        });

        // Update the response with the revenue claim result
        serializedResponse.parentClaimRevenue = parentClaimRevenue;
      } catch (revenueErr: any) {
        console.warn('Failed to claim revenue for parent IP:', revenueErr.message);
        // Do not set an error in the UI; the derivative registration was still successful
      }

      // Serialize response to handle BigInt
      serializedResponse = JSON.parse(
        JSON.stringify(serializedResponse, (key, value) =>
          typeof value === 'bigint' ? value.toString() : value
        )
      );

      setResult(serializedResponse);
    } catch (err: any) {
      setError(`Failed to register derivative: ${err.message}`);
      console.error('Transaction error:', err);
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
      <h1 className="text-2xl font-bold mb-4">Register Commercial Derivative IP Asset</h1>

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
          <p className="text-yellow-800">Please connect your wallet to register a derivative IP asset.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Parent IP ID</label>
          <input
            type="text"
            name="parentIpId"
            value={formData.parentIpId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            placeholder="Enter the parent IP Asset ID (e.g., 0x...)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">License Terms ID</label>
          <input
            type="text"
            name="licenseTermsId"
            value={formData.licenseTermsId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            placeholder="Enter the license terms ID (e.g., 96)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Created At (Unix Timestamp)</label>
          <input
            type="text"
            name="createdAt"
            value={formData.createdAt}
            onChange={handleChange}
            className="w-full p-2 border rounded"
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
            required
            readOnly
            title="This will be automatically set to your connected wallet address"
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
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Image Hash</label>
          <input
            type="text"
            name="imageHash"
            value={formData.imageHash}
            onChange={handleChange}
            className="w-full p-2 border rounded"
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
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Media Hash</label>
          <input
            type="text"
            name="mediaHash"
            value={formData.mediaHash}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Media Type</label>
          <input
            type="text"
            name="mediaType"
            value={formData.mediaType}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">NFT Name</label>
          <input
            type="text"
            name="nftName"
            value={formData.nftName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">NFT Description</label>
          <textarea
            name="nftDescription"
            value={formData.nftDescription}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Suno Artist</label>
          <input
            type="text"
            name="sunoArtist"
            value={formData.sunoArtist}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Artist ID</label>
          <input
            type="text"
            name="artistId"
            value={formData.artistId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Minting Fee</label>
          <input
            type="number"
            name="mintingFee"
            value={formData.mintingFee}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Commercial Revenue Share (%)</label>
          <input
            type="number"
            name="commercialRevShare"
            value={formData.commercialRevShare}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            min="0"
            max="100"
            step="0.01"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !isConnected}
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Registering...' : 'Register Derivative IP Asset'}
        </button>
      </form>
      {result && (
        <div className="mt-4 p-4 bg-green-100 rounded text-black">
          <h2 className="text-lg font-semibold text-black">Success!</h2>
          <p>Transaction Hash: {result.txHash}</p>
          <p>Derivative IP Asset ID: {result.childIpId || 'N/A'}</p>
          <p>Parent Claim Revenue Receipt: {result.parentClaimRevenue ? JSON.stringify(result.parentClaimRevenue) : 'No revenue claimed'}</p>
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