/* eslint-disable @typescript-eslint/no-explicit-any */


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
