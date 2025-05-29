/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { useState } from "react";
import { registerIpAssetSimple } from "../lib/registerIpAsset";

interface RegistrationResult {
  success: boolean;
  txHash: string;
  ipId: string;
  tokenId: string;
  explorerUrl: string;
}

export default function UploadAndRegister() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RegistrationResult | null>(null);
  const [error, setError] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.startsWith('image/')) {
        setError("Please select an image file");
        return;
      }
      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }
      setFile(selectedFile);
      setError("");
      setResult(null);
    }
  };

  const handleRegister = async () => {
    if (!file) {
      setError("Please select an image file");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      console.log("Starting registration process...");
      const response = await registerIpAssetSimple(file);
      setResult(response);
      console.log("Registration successful:", response);
    } catch (err: any) {
      console.error("Registration failed:", err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Register IP Asset</h2>
      
      {/* File Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Image File
        </label>
        <input 
          type="file" 
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {file && (
          <p className="text-sm text-gray-600 mt-1">
            Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Register Button */}
      <button
        onClick={handleRegister}
        disabled={loading || !file}
        className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
          loading || !file
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Registering...
          </span>
        ) : (
          "Register IP Asset"
        )}
      </button>

      {/* Success Result */}
      {result && (
        <div className="mt-6 p-4 bg-green-100 border border-green-400 rounded-md">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            ✅ Registration Successful!
          </h3>
          <div className="space-y-2 text-sm">
            <p><strong>IP Asset ID:</strong> <code className="bg-gray-100 px-1 rounded">{result.ipId}</code></p>
            <p><strong>Token ID:</strong> <code className="bg-gray-100 px-1 rounded">{result.tokenId}</code></p>
            <p><strong>Transaction:</strong> 
              <a 
                href={`https://aeneid.explorer.story.foundation/tx/${result.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline ml-1"
              >
                View on Explorer
              </a>
            </p>
            <p>
              <strong>IP Asset:</strong>
              <a 
                href={result.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline ml-1"
              >
                View IP Asset
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Setup Instructions */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <h4 className="font-semibold text-yellow-800 mb-2">Setup Checklist:</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>✓ Add Aeneid testnet to MetaMask</li>
          <li>✓ Get AEN tokens from faucet</li>
          <li>✓ Set PINATA_JWT in .env.local</li>
          <li>✓ Connect wallet to Aeneid network</li>
        </ul>
      </div>
    </div>
  );
}