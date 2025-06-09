/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { NonCommercialSocialRemixingTermsId } from '../lib/utils';

export default function MintDerivativeForm() {
    const [formData, setFormData] = useState({
        parentIpId: '0x641E638e8FCA4d4844F509630B34c9D524d40BE5',
        licenseTermsId: NonCommercialSocialRemixingTermsId,
        ipMetadataUri: 'test-uri',
        ipMetadataHash: '0x' + '0'.repeat(64), // Placeholder 32-byte hex
        nftMetadataUri: 'test-nft-uri',
        nftMetadataHash: '0x' + '0'.repeat(64), // Placeholder 32-byte hex
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('/api/mint-derivatives', {
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
        <div className="max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Mint Derivative IP Asset</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Parent IP ID</label>
                    <input
                        type="text"
                        name="parentIpId"
                        value={formData.parentIpId}
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
                <div>
                    <label className="block text-sm font-medium">IP Metadata URI</label>
                    <input
                        type="text"
                        name="ipMetadataUri"
                        value={formData.ipMetadataUri}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        placeholder="e.g., https://ipfs.io/ipfs/..."
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
                        placeholder="0x..."
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">NFT Metadata URI</label>
                    <input
                        type="text"
                        name="nftMetadataUri"
                        value={formData.nftMetadataUri}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        placeholder="e.g., https://ipfs.io/ipfs/..."
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
                        placeholder="0x..."
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                    {loading ? 'Minting...' : 'Mint Derivative IP Asset'}
                </button>
            </form>
            {result && result.explorerUrl && (
                <div className="mt-4 p-4 bg-green-100 rounded text-black">
                    <h3 className="text-lg font-semibold text-black">Success!</h3>
                    <p>Transaction Hash: {result.txHash}</p>
                    <p>Derivative IP Asset ID: {result.ipId}</p>
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
                    <h3 className="text-lg font-semibold text-black">Error</h3>
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
}