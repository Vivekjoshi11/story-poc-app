/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { createStoryClient } from '../lib/config';
import { StoryClient } from '@story-protocol/core-sdk';

export default function EditIpForm() {
  const [formData, setFormData] = useState({
    ipId: '',
    title: '',
    description: '',
    createdAt: '',
    creatorName: '',
    creatorAddress: '',
    imageUrl: '',
    imageHash: '',
    mediaUrl: '',
    mediaHash: '',
    mediaType: '',
    nftName: '',
    nftDescription: '',
    sunoArtist: '',
    artistId: '',
  });
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Wagmi hooks
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    if (!formData.ipId) {
      setError('Please enter an IP Asset ID');
      return;
    }
    setSearchLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/get-ip-metadata?ipId=${formData.ipId}`);
      const data = await response.json();
      if (data.success) {
        setFormData({
          ipId: formData.ipId,
          title: data.ipMetadata.title || '',
          description: data.ipMetadata.description || '',
          createdAt: data.ipMetadata.createdAt || '',
          creatorName: data.ipMetadata.creatorName || '',
          creatorAddress: data.ipMetadata.creatorAddress || '',
          imageUrl: data.ipMetadata.image || '',
          imageHash: data.ipMetadata.imageHash || '',
          mediaUrl: data.ipMetadata.mediaUrl || '',
          mediaHash: data.ipMetadata.mediaHash || '',
          mediaType: data.ipMetadata.mediaType || '',
          nftName: data.nftMetadata.name || '',
          nftDescription: data.nftMetadata.description || '',
          sunoArtist: data.ipMetadata.sunoArtist || '',
          artistId: data.ipMetadata.artistId || '',
        });
      } else {
        setError(data.error || 'Failed to fetch metadata');
      }
    } catch (err) {
      setError('Error fetching metadata: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setSearchLoading(false);
    }
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
      const response = await fetch('/api/edit-ip', {
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

      // Perform the transaction client-side
      const txResponse = await client.ipAccount.setIpMetadata({
        ipId: formData.ipId,
        metadataURI: data.metadataURI,
        metadataHash: data.metadataHash,
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
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Edit IP Asset</h1>

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
          <p className="text-yellow-800">Please connect your wallet to edit an IP asset.</p>
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm">IP Asset ID</label>
        <div className="flex space-x-2">
          <input
            type="text"
            name="ipId"
            value={formData.ipId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="0x..."
            required
          />
          <button
            type="button"
            onClick={handleSearch}
            disabled={searchLoading}
            className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-300"
          >
            {searchLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm">Title</label>
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
          <label className="block text-sm">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm">Created At (Unix Timestamp)</label>
          <input
            type="text"
            name="createdAt"
            value={formData.createdAt}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm">Creator Name</label>
          <input
            type="text"
            name="creatorName"
            value={formData.creatorName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm">Creator Address</label>
          <input
            type="text"
            name="creatorAddress"
            value={formData.creatorAddress}
            className="w-full p-2 border rounded bg-gray-100"
            readOnly
            title="This will be automatically set to your connected wallet address"
          />
          <p className="text-xs text-gray-500 mt-1">
            This will be automatically set to your connected wallet address
          </p>
        </div>
        <div>
          <label className="block text-sm">Image URL</label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm">Image Hash</label>
          <input
            type="text"
            name="imageHash"
            value={formData.imageHash}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm">Media URL</label>
          <input
            type="url"
            name="mediaUrl"
            value={formData.mediaUrl}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm">Media Hash</label>
          <input
            type="text"
            name="mediaHash"
            value={formData.mediaHash}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm">Media Type</label>
          <input
            type="text"
            name="mediaType"
            value={formData.mediaType}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm">NFT Name</label>
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
          <label className="block text-sm">NFT Description</label>
          <textarea
            name="nftDescription"
            value={formData.nftDescription}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm">Suno Artist</label>
          <input
            type="text"
            name="sunoArtist"
            value={formData.sunoArtist}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm">Artist ID</label>
          <input
            type="text"
            name="artistId"
            value={formData.artistId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !isConnected}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
        >
          {loading ? 'Updating...' : 'Update IP Asset'}
        </button>
      </form>
      {result && (
        <div className="mt-4 p-4 bg-green-100 rounded">
          <h2 className="text-lg font-semibold">Success!</h2>
          <p>Transaction Hash: {result.txHash}</p>
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-100 rounded">
          <h2 className="text-lg font-semibold">Error</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}