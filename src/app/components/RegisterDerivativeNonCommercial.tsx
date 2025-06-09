/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('/api/registerDerivativeNonCommercial', {
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
                    disabled={loading}
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