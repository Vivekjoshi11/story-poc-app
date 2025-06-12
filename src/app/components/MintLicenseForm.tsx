// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';

// export default function MintLicenseForm() {
//     const [formData, setFormData] = useState({
//         ipId: '0x641E638e8FCA4d4844F509630B34c9D524d40BE5',
//         licenseTermsId: '1',
//     });
//     const [loading, setLoading] = useState(false);
//     const [result, setResult] = useState<any>(null);
//     const [error, setError] = useState<string | null>(null);
//     const router = useRouter();

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setLoading(true);
//         setError(null);
//         setResult(null);

//         try {
//             const response = await fetch('/api/mint-license', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(formData),
//             });
//             const data = await response.json();

//             if (data.success) {
//                 setResult(data);
//             } else {
//                 setError(data.error);
//             }
//         } catch (err) {
//             setError('An unexpected error occurred');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="max-w-2xl mx-auto p-6">
//             <h1 className="text-2xl font-bold mb-4">Mint License Tokens</h1>
//             <form onSubmit={handleSubmit} className="space-y-4">
//                 <div>
//                     <label className="block text-sm font-medium">IP ID</label>
//                     <input
//                         type="text"
//                         name="ipId"
//                         value={formData.ipId}
//                         onChange={handleChange}
//                         className="w-full p-2 border rounded"
//                         placeholder="0x..."
//                         required
//                     />
//                 </div>
//                 <div>
//                     <label className="block text-sm font-medium">License Terms ID</label>
//                     <input
//                         type="text"
//                         name="licenseTermsId"
//                         value={formData.licenseTermsId}
//                         onChange={handleChange}
//                         className="w-full p-2 border rounded"
//                         placeholder="e.g., 1"
//                         required
//                     />
//                 </div>
//                 <button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
//                 >
//                     {loading ? 'Minting...' : 'Mint License Tokens'}
//                 </button>
//             </form>
//             {result && result.explorerUrl && (
//                 <div className="mt-4 p-4 bg-green-100 rounded text-black">
//                     <h2 className="text-lg font-semibold text-black">Success!</h2>
//                     <p>Transaction Hash: {result.txHash}</p>
//                     <p>License Token IDs: {result.licenseTokenIds.join(', ')}</p>
//                     <a
//                         href={result.explorerUrl}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-blue-600 underline"
//                     >
//                         View on Explorer
//                     </a>
//                 </div>
//             )}
//             {error && (
//                 <div className="mt-4 p-4 bg-red-100 rounded text-black">
//                     <h2 className="text-lg font-semibold text-black">Error</h2>
//                     <p>{error}</p>
//                 </div>
//             )}
//         </div>
//     );
// }


/* eslint-disable @typescript-eslint/no-unused-vars */
   /* eslint-disable @typescript-eslint/no-explicit-any */
   'use client';

   import { useState, useEffect } from 'react';
   import { useRouter } from 'next/navigation';
   import { useAccount, useWalletClient } from 'wagmi';
   import { ConnectButton } from '@rainbow-me/rainbowkit';
   import { createStoryClient, networkInfo } from '../lib/config';
   import { Address } from 'viem';

   export default function MintLicenseForm() {
       const [formData, setFormData] = useState({
           ipId: '0x641E638e8FCA4d4844F509630B34c9D524d40BE5',
           licenseTermsId: '1',
       });
       const [loading, setLoading] = useState(false);
       const [result, setResult] = useState<any>(null);
       const [error, setError] = useState<string | null>(null);
       const router = useRouter();
       const { address, isConnected } = useAccount();
       const { data: walletClient } = useWalletClient();

       const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
           setFormData({ ...formData, [e.target.name]: e.target.value });
       };

       const handleSubmit = async (e: React.FormEvent) => {
           e.preventDefault();

           if (!isConnected || !walletClient) {
               setError('Please connect your wallet first');
               return;
           }

           setLoading(true);
           setError(null);
           setResult(null);

           try {
               const client = createStoryClient(walletClient);
               const response = await client.license.mintLicenseTokens({
                   licenseTermsId: formData.licenseTermsId,
                   licensorIpId: formData.ipId as Address,
                   amount: 1,
                   maxMintingFee: BigInt(0),
                   maxRevenueShare: 100,
                   txOptions: { waitForTransaction: true },
               });

               const serializedResponse = JSON.parse(
                   JSON.stringify(
                       {
                           success: true,
                           txHash: response.txHash,
                           licenseTokenIds: response.licenseTokenIds,
                           explorerUrl: `https://aeneid.storyscan.io/tx/${response.txHash}`,
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
               <h1 className="text-2xl font-bold mb-4">Mint License Tokens</h1>

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
                       <p className="text-yellow-800">Please connect your wallet to mint license tokens.</p>
                   </div>
               )}

               <form onSubmit={handleSubmit} className="space-y-4">
                   <div>
                       <label className="block text-sm font-medium">IP ID</label>
                       <input
                           type="text"
                           name="ipId"
                           value={formData.ipId}
                           onChange={handleChange}
                           className="w-full p-2 border rounded"
                           placeholder="0x..."
                           required
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
                           placeholder="e.g., 1"
                           required
                       />
                   </div>
                   <button
                       type="submit"
                       disabled={loading || !isConnected}
                       className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                   >
                       {loading ? 'Minting...' : 'Mint License Tokens'}
                   </button>
               </form>
               {result && result.explorerUrl && (
                   <div className="mt-4 p-4 bg-green-100 rounded text-black">
                       <h2 className="text-lg font-semibold text-black">Success!</h2>
                       <p>Transaction Hash: {result.txHash}</p>
                       <p>License Token IDs: {result.licenseTokenIds.join(', ')}</p>
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