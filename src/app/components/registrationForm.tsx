
// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAccount, useWalletClient } from 'wagmi';
// import { ConnectButton } from '@rainbow-me/rainbowkit';
// import React from 'react';

// export default function RegisterForm() {
//   const [formData, setFormData] = useState({
//     title: 'Vivek first registration',
//     description: 'This is a house-style song generated on suno.',
//     createdAt: '1740005219',
//     creatorName: 'Vivek Joshi',
//     creatorAddress: '0xA2f9Cf1E40D7b03aB81e34BC50f0A8c67B4e9112',
//     imageUrl: 'https://cdn2.suno.ai/image_large_8bcba6bc-3f60-4921-b148-f32a59086a4c.jpeg',
//     imageHash: '0xc404730cdcdf7e5e54e8f16bc6687f97c6578a296f4a21b452d8a6ecabd61bcc',
//     mediaUrl: 'https://cdn1.suno.ai/dcd3076f-3aa5-400b-ba5d-87d30f27c311.mp3',
//     mediaHash: '0xb52a44f53b2485ba772bd4857a443e1fb942cf5dda73c870e2d2238ecd607aee',
//     mediaType: 'audio/mpeg',
//     nftName: 'Midnight Marriage',
//     nftDescription: 'This is a house-style song generated on suno. This NFT represents ownership of the IP Asset.',
//     sunoArtist: 'amazedneurofunk956',
//     artistId: '4123743b-8ba6-4028-a965-75b79a3ad424',
//   });
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState<any>(null);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();
  
//   // Wagmi hooks
//   const { address, isConnected } = useAccount();
//   const { data: walletClient } = useWalletClient();

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const updatedFormData = { ...formData, [e.target.name]: e.target.value };
    
//     // Auto-update creator address when wallet is connected
//     if (e.target.name !== 'creatorAddress' && address) {
//       updatedFormData.creatorAddress = address;
//     }
    
//     setFormData(updatedFormData);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!isConnected || !address || !walletClient) {
//       setError('Please connect your wallet first');
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setResult(null);

//     try {
//       // Update creator address to connected wallet address
//       const updatedFormData = {
//         ...formData,
//         creatorAddress: address,
//       };

//       const response = await fetch('/api/register-ip', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           ...updatedFormData,
//           walletAddress: address, // Send wallet address to API
//         }),
//       });
//       const data = await response.json();

//       if (data.success) {
//         setResult(data);
//       } else {
//         setError(data.error);
//       }
//     } catch (err) {
//       setError('An unexpected error occurred');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Auto-update creator address when wallet connects
//   React.useEffect(() => {
//     if (address && isConnected) {
//       setFormData(prev => ({ ...prev, creatorAddress: address }));
//     }
//   }, [address, isConnected]);

//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-4">Register IP Asset</h1>
      
//       {/* Wallet Connection */}
//       <div className="mb-6">
//         <ConnectButton />
//         {isConnected && address && (
//           <p className="text-sm text-gray-600 mt-2">
//             Connected: {address}
//           </p>
//         )}
//       </div>

//       {!isConnected && (
//         <div className="mb-4 p-4 bg-yellow-100 rounded">
//           <p className="text-yellow-800">Please connect your wallet to register an IP asset.</p>
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium">Title</label>
//           <input
//             type="text"
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Description</label>
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Created At (Unix Timestamp)</label>
//           <input
//             type="text"
//             name="createdAt"
//             value={formData.createdAt}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Creator Name</label>
//           <input
//             type="text"
//             name="creatorName"
//             value={formData.creatorName}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Creator Address</label>
//           <input
//             type="text"
//             name="creatorAddress"
//             value={formData.creatorAddress}
//             onChange={handleChange}
//             className="w-full p-2 border rounded bg-green-900"
//             required
//             readOnly
//             title="This will be automatically set to your connected wallet address"
//           />
//           <p className="text-xs text-gray-500 mt-1">
//             This will be automatically set to your connected wallet address
//           </p>
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Image URL</label>
//           <input
//             type="url"
//             name="imageUrl"
//             value={formData.imageUrl}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Image Hash</label>
//           <input
//             type="text"
//             name="imageHash"
//             value={formData.imageHash}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Media URL</label>
//           <input
//             type="url"
//             name="mediaUrl"
//             value={formData.mediaUrl}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Media Hash</label>
//           <input
//             type="text"
//             name="mediaHash"
//             value={formData.mediaHash}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Media Type</label>
//           <input
//             type="text"
//             name="mediaType"
//             value={formData.mediaType}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">NFT Name</label>
//           <input
//             type="text"
//             name="nftName"
//             value={formData.nftName}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">NFT Description</label>
//           <textarea
//             name="nftDescription"
//             value={formData.nftDescription}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Suno Artist</label>
//           <input
//             type="text"
//             name="sunoArtist"
//             value={formData.sunoArtist}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Artist ID</label>
//           <input
//             type="text"
//             name="artistId"
//             value={formData.artistId}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           disabled={loading || !isConnected}
//           className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
//         >
//           {loading ? 'Registering...' : 'Register IP Asset'}
//         </button>
//       </form>
//       {result && (
//         <div className="mt-4 p-4 bg-green-100 rounded text-black">
//           <h2 className="text-lg font-semibold text-black">Success!</h2>
//           <p>Transaction Hash: {result.txHash}</p>
//           <p>IP Asset ID: {result.ipId}</p>
//           <p>License Terms IDs: {result.licenseTermsIds.join(', ')}</p>
//           <a
//             href={result.explorerUrl}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-blue-600 underline"
//           >
//             View on Explorer
//           </a>
//         </div>
//       )}
//       {error && (
//         <div className="mt-4 p-4 bg-red-100 rounded text-red">
//           <h2 className="text-lg font-semibold">Error</h2>
//           <p>{error}</p>
//         </div>
//       )}
//     </div>
//   );
// }




// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAccount, useWalletClient } from 'wagmi';
// import { ConnectButton } from '@rainbow-me/rainbowkit';

// export default function RegisterForm() {
//   const [formData, setFormData] = useState({
//     title: 'Vivek first registration',
//     description: 'This is a house-style song generated on suno.',
//     createdAt: '1740005219',
//     creatorName: 'Vivek Joshi',
//     creatorAddress: '',
//     imageUrl: 'https://cdn2.suno.ai/image_large_8bcba6bc-3f60-4921-b148-f32a59086a4c.jpeg',
//     imageHash: '0xc404730cdcdf7e5e54e8f16bc6687f97c6578a296f4a21b452d8a6ecabd61bcc',
//     mediaUrl: 'https://cdn1.suno.ai/dcd3076f-3aa5-400b-ba5d-87d30f27c311.mp3',
//     mediaHash: '0xb52a44f53b2485ba772bd4857a443e1fb942cf5dda73c870e2d2238ecd607aee',
//     mediaType: 'audio/mpeg',
//     nftName: 'Midnight Marriage',
//     nftDescription: 'This is a house-style song generated on suno. This NFT represents ownership of the IP Asset.',
//     sunoArtist: 'amazedneurofunk956',
//     artistId: '4123743b-8ba6-4028-a965-75b79a3ad424',
//   });
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState<any>(null);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();
  
//   // Wagmi hooks
//   const { address, isConnected } = useAccount();
//   const { data: walletClient } = useWalletClient();

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!isConnected || !address || !walletClient) {
//       setError('Please connect your wallet first');
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setResult(null);

//     try {
//       const response = await fetch('/api/register-ip', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           ...formData,
//           creatorAddress: address,
//           walletAddress: address,
//         }),
//       });
//       const data = await response.json();

//       if (data.success) {
//         setResult(data);
//       } else {
//         setError(data.error);
//       }
//     } catch (err) {
//       setError('An unexpected error occurred');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Auto-update creator address when wallet connects
//   useEffect(() => {
//     if (address && isConnected) {
//       setFormData(prev => ({ ...prev, creatorAddress: address }));
//     }
//   }, [address, isConnected]);

//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-4">Register IP Asset</h1>
      
//       {/* Wallet Connection */}
//       <div className="mb-6">
//         <ConnectButton />
//         {isConnected && address && (
//           <p className="text-sm text-gray-600 mt-2">
//             Connected: {address}
//           </p>
//         )}
//       </div>

//       {!isConnected && (
//         <div className="mb-4 p-4 bg-yellow-100 rounded">
//           <p className="text-yellow-800">Please connect your wallet to register an IP asset.</p>
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium">Title</label>
//           <input
//             type="text"
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Description</label>
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Created At (Unix Timestamp)</label>
//           <input
//             type="text"
//             name="createdAt"
//             value={formData.createdAt}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Creator Name</label>
//           <input
//             type="text"
//             name="creatorName"
//             value={formData.creatorName}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Creator Address</label>
//           <input
//             type="text"
//             name="creatorAddress"
//             value={formData.creatorAddress}
//             className="w-full p-2 border rounded bg-gray-100"
//             required
//             readOnly
//             title="This will be automatically set to your connected wallet address"
//           />
//           <p className="text-xs text-gray-500 mt-1">
//             This will be automatically set to your connected wallet address
//           </p>
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Image URL</label>
//           <input
//             type="url"
//             name="imageUrl"
//             value={formData.imageUrl}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Image Hash</label>
//           <input
//             type="text"
//             name="imageHash"
//             value={formData.imageHash}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Media URL</label>
//           <input
//             type="url"
//             name="mediaUrl"
//             value={formData.mediaUrl}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Media Hash</label>
//           <input
//             type="text"
//             name="mediaHash"
//             value={formData.mediaHash}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Media Type</label>
//           <input
//             type="text"
//             name="mediaType"
//             value={formData.mediaType}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">NFT Name</label>
//           <input
//             type="text"
//             name="nftName"
//             value={formData.nftName}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">NFT Description</label>
//           <textarea
//             name="nftDescription"
//             value={formData.nftDescription}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Suno Artist</label>
//           <input
//             type="text"
//             name="sunoArtist"
//             value={formData.sunoArtist}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Artist ID</label>
//           <input
//             type="text"
//             name="artistId"
//             value={formData.artistId}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           disabled={loading || !isConnected}
//           className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
//         >
//           {loading ? 'Registering...' : 'Register IP Asset'}
//         </button>
//       </form>
//       {result && (
//         <div className="mt-4 p-4 bg-green-100 rounded text-black">
//           <h2 className="text-lg font-semibold text-black">Success!</h2>
//           <p>Transaction Hash: {result.txHash}</p>
//           <p>IP Asset ID: {result.ipId}</p>
//           <p>License Terms IDs: {result.licenseTermsIds.join(', ')}</p>
//           <a
//             href={result.explorerUrl}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-blue-600 underline"
//           >
//             View on Explorer
//           </a>
//         </div>
//       )}
//       {error && (
//         <div className="mt-4 p-4 bg-red-100 rounded text-red-800">
//           <h2 className="text-lg font-semibold">Error</h2>
//           <p>{error}</p>
//         </div>
//       )}
//     </div>
//   );
// }


/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount, useWalletClient } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { createStoryClient, networkInfo } from '../lib/config';
import { StoryClient } from '@story-protocol/core-sdk';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    title: 'Vivek first registration',
    description: 'This is a house-style song generated on suno.',
    createdAt: '1740005219',
    creatorName: 'Vivek Joshi',
    creatorAddress: '',
    imageUrl: 'https://cdn2.suno.ai/image_large_8bcba6bc-3f60-4921-b148-f32a59086a4c.jpeg',
    imageHash: '0xc404730cdcdf7e5e54e8f16bc6687f97c6578a296f4a21b452d8a6ecabd61bcc',
    mediaUrl: 'https://cdn1.suno.ai/dcd3076f-3aa5-400b-ba5d-87d30f27c311.mp3',
    mediaHash: '0xb52a44f53b2485ba772bd4857a443e1fb942cf5dda73c870e2d2238ecd607aee',
    mediaType: 'audio/mpeg',
    nftName: 'Midnight Marriage',
    nftDescription: 'This is a house-style song generated on suno. This NFT represents ownership of the IP Asset.',
    sunoArtist: 'amazedneurofunk956',
    artistId: '4123743b-8ba6-4028-a965-75b79a3ad424',
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
      const response = await fetch('/api/register-ip', {
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
      const txResponse = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
        spgNftContract: data.spgNftContract,
        licenseTermsData: [
          {
            terms: data.terms,
          },
        ],
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
            licenseTermsIds: txResponse.licenseTermsIds,
            explorerUrl: `${networkInfo.protocolExplorer}/ipa/${txResponse.ipId}`,
          },
          (key, value) => (typeof value === 'bigint' ? value.toString() : value)
        )
      );

      setResult(serializedResponse);
    } catch (err:any) {
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
      <h1 className="text-2xl font-bold mb-4">Register IP Asset</h1>
      
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
          <p className="text-yellow-800">Please connect your wallet to register an IP asset.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
            required
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
            required
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
            required
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
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading || !isConnected}
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Registering...' : 'Register IP Asset'}
        </button>
      </form>
      {result && (
        <div className="mt-4 p-4 bg-green-100 rounded text-black">
          <h2 className="text-lg font-semibold text-black">Success!</h2>
          <p>Transaction Hash: {result.txHash}</p>
          <p>IP Asset ID: {result.ipId}</p>
          <p>License Terms IDs: {result.licenseTermsIds.join(', ')}</p>
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