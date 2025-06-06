/* eslint-disable @typescript-eslint/no-explicit-any */
// // /* eslint-disable @typescript-eslint/no-unused-vars */

// "use client";

// import { useState } from "react";
// import { registerIpAssetSimple } from "../lib/registerIpAsset";

// interface RegistrationResult {
//   success: boolean;
//   txHash: string;
//   ipId: string;
//   tokenId: string;
//   explorerUrl: string;
// }

// export default function UploadAndRegister() {
//   const [file, setFile] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState<RegistrationResult | null>(null);
//   const [error, setError] = useState<string>("");

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files?.[0];
//     if (selectedFile) {
//       // Validate file type
//       if (!selectedFile.type.startsWith('image/')) {
//         setError("Please select an image file");
//         return;
//       }
//       // Validate file size (max 10MB)
//       if (selectedFile.size > 10 * 1024 * 1024) {
//         setError("File size must be less than 10MB");
//         return;
//       }
//       setFile(selectedFile);
//       setError("");
//       setResult(null);
//     }
//   };

//   const handleRegister = async () => {
//     if (!file) {
//       setError("Please select an image file");
//       return;
//     }

//     setLoading(true);
//     setError("");
    
//     try {
//       console.log("Starting registration process...");
//       const response = await registerIpAssetSimple(file);
//       setResult(response);
//       console.log("Registration successful:", response);
//     } catch (err: any) {
//       console.error("Registration failed:", err);
//       setError(err.message || "Registration failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
//       <h2 className="text-2xl font-bold mb-6 text-center">Register IP Asset</h2>
      
//       {/* File Input */}
//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Select Image File
//         </label>
//         <input 
//           type="file" 
//           accept="image/*"
//           onChange={handleFileChange}
//           className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//         />
//         {file && (
//           <p className="text-sm text-gray-600 mt-1">
//             Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
//           </p>
//         )}
//       </div>

//       {/* Error Display */}
//       {error && (
//         <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
//           {error}
//         </div>
//       )}

//       {/* Register Button */}
//       <button
//         onClick={handleRegister}
//         disabled={loading || !file}
//         className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
//           loading || !file
//             ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//             : "bg-blue-500 text-white hover:bg-blue-600"
//         }`}
//       >
//         {loading ? (
//           <span className="flex items-center justify-center">
//             <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//             </svg>
//             Registering...
//           </span>
//         ) : (
//           "Register IP Asset"
//         )}
//       </button>

//       {/* Success Result */}
//       {result && (
//         <div className="mt-6 p-4 bg-green-100 border border-green-400 rounded-md">
//           <h3 className="text-lg font-semibold text-green-800 mb-2">
//             ✅ Registration Successful!
//           </h3>
//           <div className="space-y-2 text-sm">
//             <p><strong>IP Asset ID:</strong> <code className="bg-gray-100 px-1 rounded">{result.ipId}</code></p>
//             <p><strong>Token ID:</strong> <code className="bg-gray-100 px-1 rounded">{result.tokenId}</code></p>
//             <p><strong>Transaction:</strong> 
//               <a 
//                 href={`https://aeneid.explorer.story.foundation/tx/${result.txHash}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-blue-600 hover:underline ml-1"
//               >
//                 View on Explorer
//               </a>
//             </p>
//             <p>
//               <strong>IP Asset:</strong>
//               <a 
//                 href={result.explorerUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="text-blue-600 hover:underline ml-1"
//               >
//                 View IP Asset
//               </a>
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Setup Instructions */}
//       <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
//         <h4 className="font-semibold text-yellow-800 mb-2">Setup Checklist:</h4>
//         <ul className="text-sm text-yellow-700 space-y-1">
//           <li>✓ Add Aeneid testnet to MetaMask</li>
//           <li>✓ Get AEN tokens from faucet</li>
//           <li>✓ Set PINATA_JWT in .env.local</li>
//           <li>✓ Connect wallet to Aeneid network</li>
//         </ul>
//       </div>
//     </div>
//   );
// }


// // Example usage in your React component
// import { useState } from 'react';
// import { registerIpAssetSimple } from '../lib/registerIpAsset';
// import WIPManager from '../utils/wipUtils';
// import { getStoryClient } from '../lib/storyClient';

// const IPRegistrationComponent = () => {
//   const [loading, setLoading] = useState(false);
//   const [balances, setBalances] = useState(null);

//   // Check balances
//   const checkBalances = async () => {
//     try {
//       const { address } = await getStoryClient();
//       const balanceInfo = await WIPManager.getBalances(address);
//       setBalances(balanceInfo);
//       console.log("Balances:", balanceInfo);
//     } catch (error) {
//       console.error("Error checking balances:", error);
//     }
//   };

//   // Wrap IP to WIP manually
//   const wrapIPTokens = async (amount: string) => {
//     try {
//       setLoading(true);
//       const { walletClient } = await getStoryClient();
//       await WIPManager.wrapIP(amount, walletClient);
//       await checkBalances(); // Refresh balances
//       alert("Successfully wrapped IP to WIP!");
//     } catch (error) {
//       console.error("Error wrapping IP:", error);
//       alert("Failed to wrap IP: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Register IP Asset (now handles WIP automatically)
//   const registerAsset = async (imageFile: File) => {
//     try {
//       setLoading(true);
//       const result = await registerIpAssetSimple(imageFile);
//       console.log("Registration result:", result);
//       alert("IP Asset registered successfully!");
//     } catch (error) {
//       console.error("Registration failed:", error);
//       alert("Registration failed: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold mb-4">IP Asset Registration with WIP</h2>
      
//       {/* Balance Display */}
//       <div className="mb-4 p-4 bg-gray-100 rounded">
//         <button onClick={checkBalances} className="bg-blue-500 text-white px-4 py-2 rounded mb-2">
//           Check Balances
//         </button>
//         {balances && (
//           <div className='text-black'>
//             <p>IP Balance: {balances.ip.formatted} IP</p>
//             <p>WIP Balance: {balances.wip.formatted} WIP</p>
//           </div>
//         )}
//       </div>

//       {/* Manual WIP Wrapping */}
//       <div className="mb-4 p-4 bg-yellow-100 rounded">
//         <h3 className="font-bold mb-2">Manual WIP Wrapping</h3>
//         <button 
//           onClick={() => wrapIPTokens("1.0")}
//           disabled={loading}
//           className="bg-green-500 text-white px-4 py-2 rounded mr-2"
//         >
//           {loading ? "Wrapping..." : "Wrap 1 IP → WIP"}
//         </button>
//         <button 
//           onClick={() => wrapIPTokens("5.0")}
//           disabled={loading}
//           className="bg-green-600 text-white px-4 py-2 rounded"
//         >
//           {loading ? "Wrapping..." : "Wrap 5 IP → WIP"}
//         </button>
//       </div>

//       {/* File Upload for IP Registration */}
//       <div className="mb-4">
//         <input 
//           type="file" 
//           accept="image/*"
//           onChange={(e) => {
//             if (e.target.files?.[0]) {
//               registerAsset(e.target.files[0]);
//             }
//           }}
//           disabled={loading}
//           className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//         />
//         <p className="text-sm text-gray-600 mt-1">
//           Select an image to register as IP Asset (WIP conversion will happen automatically)
//         </p>
//       </div>

//       {loading && (
//         <div className="text-center p-4">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
//           <p className="mt-2">Processing...</p>
//         </div>
//       )}
      
//     </div>
//   );
// };

// export default IPRegistrationComponent;

import { useState } from 'react';
import { registerIpAssetSimple } from '../lib/registerIpAsset';
import WIPManager from '../utils/wipUtils';
import { getStoryClient } from '../lib/storyClient';

const IPRegistrationComponent = () => {
  const [loading, setLoading] = useState(false);
  const [balances, setBalances] = useState<null | { ip: any; wip: any }>(null);
  const [approveTxHash, setApproveTxHash] = useState<string | null>(null);
  const [registerTxHash, setRegisterTxHash] = useState<string | null>(null);
  const [ipId, setIpId] = useState<string | null>(null);

  const checkBalances = async () => {
    try {
      const { address } = await getStoryClient();
      const balanceInfo = await WIPManager.getBalances(address);
      setBalances(balanceInfo);
      console.log("Balances:", balanceInfo);
    } catch (error) {
      console.error("Error checking balances:", error);
    }
  };

  const wrapIPTokens = async (amount: string) => {
    try {
      setLoading(true);
      const { walletClient } = await getStoryClient();
      await WIPManager.wrapIP(amount, walletClient);
      await checkBalances();
      alert("Successfully wrapped IP to WIP!");
    } catch (error: any) {
      console.error("Error wrapping IP:", error);
      alert("Failed to wrap IP: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const registerAsset = async (imageFile: File) => {
    setLoading(true);
    let result = null;
    try {
      result = await registerIpAssetSimple(imageFile);
      console.log("Registration result:", result);
      alert("IP Asset registered successfully!");
    } catch (error: any) {
      console.error("Registration failed:", error);
      alert("Registration failed: " + error.message);

      // If the error itself has hashes (sometimes not thrown directly from registerIpAssetSimple)
      if (error.approveTx || error.registerTx || error.ipId) {
        result = error; // fallback
      }
    } finally {
      if (result) {
        if (result.approveTx) setApproveTxHash(result.approveTx);
        if (result.registerTx) setRegisterTxHash(result.registerTx);
        if (result.ipId) setIpId(result.ipId);
      }
      setLoading(false);
    }
  };

  return (
    <div className="p-4 text-black">
      <h2 className="text-2xl font-bold mb-4">IP Asset Registration with WIP</h2>

      <div className="mb-4 p-4 bg-gray-100 rounded">
        <button
          onClick={checkBalances}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-2"
        >
          Check Balances
        </button>
        {balances && (
          <div>
            <p>IP Balance: {balances.ip.formatted} IP</p>
            <p>WIP Balance: {balances.wip.formatted} WIP</p>
          </div>
        )}
      </div>

      <div className="mb-4 p-4 bg-yellow-100 rounded">
        <h3 className="font-bold mb-2">Manual WIP Wrapping</h3>
        <button
          onClick={() => wrapIPTokens("1.0")}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded mr-2"
        >
          {loading ? "Wrapping..." : "Wrap 1 IP → WIP"}
        </button>
        <button
          onClick={() => wrapIPTokens("5.0")}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Wrapping..." : "Wrap 5 IP → WIP"}
        </button>
      </div>

      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              registerAsset(e.target.files[0]);
            }
          }}
          disabled={loading}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <p className="text-sm text-gray-600 mt-1">
          Select an image to register as IP Asset
        </p>
      </div>

      {/* Show Transaction Hashes */}
      <div className="mt-4">
        {approveTxHash && (
          <div className="bg-green-100 text-green-700 p-2 rounded mb-2">
            ✅ Approval Tx:{" "}
            <a
              href={`https://sepolia.etherscan.io/tx/${approveTxHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {approveTxHash}
            </a>
          </div>
        )}
        {registerTxHash && (
          <div className="bg-green-100 text-green-700 p-2 rounded mb-2">
            🎉 Register Tx:{" "}
            <a
              href={`https://sepolia.etherscan.io/tx/${registerTxHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {registerTxHash}
            </a>
          </div>
        )}
        {ipId && (
          <div className="bg-blue-100 text-blue-700 p-2 rounded">
            🔍 View IP Asset on StoryScan:{" "}
            <a
              href={`https://aeneid.storyscan.io/ipa/${ipId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {ipId}
            </a>
          </div>
        )}
      </div>

      {loading && (
        <div className="text-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2">Processing...</p>
        </div>
      )}
    </div>
  );
};

export default IPRegistrationComponent;
