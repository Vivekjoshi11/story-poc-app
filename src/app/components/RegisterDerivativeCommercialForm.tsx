/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Address } from 'viem';

// export default function RegisterDerivativeForm() {
//   const [formData, setFormData] = useState({
//     ipTitle: 'Derivative IP Example',
//     ipDescription: 'This is a derivative house-style song generated on suno.',
//     ipCreatedAt: '1740005219',
//     creatorName: 'Vivek Joshi',
//     creatorAddress: '0xA2f9Cf1E40D7b03aB81e34BC50f0A8c67B4e9112',
//     imageUrl: 'https://cdn2.suno.ai/image_large_8bcba6bc-3f60-4921-b148-f32a59086a4c.jpeg',
//     imageHash: '0xc404730cdcdf7e5e54e8f16bc6687f97c6578a296f4a21b452d8a6ecabd61bcc',
//     mediaUrl: 'https://cdn1.suno.ai/dcd3076f-3aa5-400b-ba5d-87d30f27c311.mp3',
//     mediaHash: '0xb52a44f53b2485ba772bd4857a443e1fb942cf5dda73c870e2d2238ecd607aee',
//     mediaType: 'audio/mpeg',
//     nftName: 'Derivative Midnight Marriage',
//     nftDescription: 'This NFT represents a derivative IP Asset linked to a parent IP.',
//     sunoArtist: 'amazedneurofunk956',
//     artistId: '4123743b-8ba6-4028-a965-75b79a3ad424',
//   });
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState<any>(null);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const PARENT_IP_ID: Address = '0x641E638e8FCA4d4844F509630B34c9D524d40BE5';
//   const PARENT_LICENSE_TERMS_ID: string = '96';
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setResult(null);

//     try {
//       const response = await fetch('/api/register-derivative-commercial', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
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

//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-4">Register Derivative IP Asset</h1>
//       <p className="mb-4 text-sm text-gray-600">
//         This will create a derivative IP Asset linked to Parent IP ID: {PARENT_IP_ID} with License Terms ID: {PARENT_LICENSE_TERMS_ID}.
//       </p>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium">IP Title</label>
//           <input
//             type="text"
//             name="ipTitle"
//             value={formData.ipTitle}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">IP Description</label>
//           <textarea
//             name="ipDescription"
//             value={formData.ipDescription}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Created At (Unix Timestamp)</label>
//           <input
//             type="text"
//             name="ipCreatedAt"
//             value={formData.ipCreatedAt}
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
//             className="w-full p-2 border rounded"
//             required
//           />
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
//           disabled={loading}
//           className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
//         >
//           {loading ? 'Registering...' : 'Register Derivative IP Asset'}
//         </button>
//       </form>
//       {result && (
//         <div className="mt-4 p-4 bg-green-100 rounded text-black">
//           <h2 className="text-lg font-semibold text-black">Success!</h2>
//           <p>Transaction Hash: {result.txHash}</p>
//           <p>Derivative IPA ID: {result.ipId}</p>
//           <p>Parent Revenue Claim: {JSON.stringify(result.parentClaimRevenue)}</p>
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
//         <div className="mt-4 p-4 bg-red-100 rounded">
//           <h2 className="text-lg font-semibold">Error</h2>
//           <p>{error}</p>
//         </div>
//       )}
//     </div>
//   );
// }


'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DerivativeForm() {
    const [formData, setFormData] = useState({
        ipTitle: 'Derivative IP Example', // Changed from title
        ipDescription: 'This is a derivative house-style song generated on suno.', // Changed from description
        creatorName: 'Vivek Joshi',
        creatorAddress: '0xA2f9Cf1E40D7b03aB81e34BC50f0A8c67B4e9112',
        imageUrl: 'https://cdn2.suno.ai/image_large_8bcba6bc-3f60-4921-b148-f32a59086a4c.jpeg',
        mediaUrl: 'https://cdn1.suno.ai/dcd3076f-3aa5-400b-ba5d-87d30f27c311.mp3',
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('/api/register-derivative-commercial', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();

            if (data.success) {
                setResult(data);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Register Derivative IP Asset</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Title</label>
                    <input
                        type="text"
                        name="ipTitle"
                        value={formData.ipTitle}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Description</label>
                    <textarea
                        name="ipDescription"
                        value={formData.ipDescription}
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
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
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
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                    {loading ? 'Registering...' : 'Register Derivative IP Asset'}
                </button>
            </form>
            {result && result.explorerUrl && (
                <div className="mt-4 p-4 bg-green-100 rounded text-black">
                    <h2 className="text-lg font-semibold text-black">Success!</h2>
                    <p>Transaction Hash: {result.txHash}</p>
                    <p>Derivative IP Asset ID: {result.ipId}</p>
                    <p>Parent Claim Revenue Receipt: {JSON.stringify(result.parentClaimRevenue)}</p>
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