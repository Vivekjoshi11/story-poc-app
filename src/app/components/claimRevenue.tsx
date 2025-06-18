'use client';

import { useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { createStoryClient } from '../lib/config';
import { Address } from 'viem';
import { WIP_TOKEN_ADDRESS } from '@story-protocol/core-sdk';

export default function ClaimRevenueForm() {
    const [formData, setFormData] = useState({
        ipId: '0xed8F51EF89d88DFf97C4a9Efecc3A25281F608D6',
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const { address, isConnected, chain } = useAccount();
    const { data: walletClient } = useWalletClient();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isConnected || !walletClient || !address) {
            setError('Please connect your wallet first');
            return;
        }

        if (!WIP_TOKEN_ADDRESS) {
            setError('WIP_TOKEN_ADDRESS is not defined');
            return;
        }

        // Log network and address for debugging
        console.log('Connected address:', address);
        console.log('Chain ID:', chain?.id);
        console.log('WIP_TOKEN_ADDRESS:', WIP_TOKEN_ADDRESS);
        console.log('Form data:', formData);

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const client = createStoryClient(walletClient);
            console.log('Client initialized:', !!client);

            const response = await client.royalty.claimAllRevenue({
                ancestorIpId: formData.ipId as Address,
                claimer: formData.ipId as Address, // Match script's claimer = IP_ID
                childIpIds: [],
                royaltyPolicies: [],
                currencyTokens: [WIP_TOKEN_ADDRESS],
                txOptions: { waitForTransaction: true },
            });

            console.log('Raw response:', response);

            const serializedResponse = JSON.parse(
                JSON.stringify(
                    {
                        success: true,
                        txHash: response.txHash,
                        claimedTokens: response.claimedTokens,
                        explorerUrl: `https://aeneid.storyscan.io/tx/${response.txHash}`,
                    },
                    (key, value) => (typeof value === 'bigint' ? value.toString() : value)
                )
            );

            setResult(serializedResponse);
        } catch (err: any) {
            console.error('Claim revenue error:', err);
            const errorMessage = err.message.includes('0x03696e76')
                ? 'Contract reverted (0x03696e76). Verify: 1) IP ID has claimable revenue, 2) Correct network (Aeneid testnet), 3) WIP_TOKEN_ADDRESS matches 0x1514000000000000000000000000000000000000, 4) SDK version aligns with script.'
                : err.message || 'An unexpected error occurred';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Claim Revenue</h1>

            <div className="mb-6">
                <ConnectButton />
                {isConnected && address && (
                    <p className="text-sm text-gray-600 mt-2">
                        Connected: {address} {chain ? `(Chain: ${chain.name}, ID: ${chain.id})` : ''}
                    </p>
                )}
            </div>

            {!isConnected && (
                <div className="mb-4 p-4 bg-yellow-100 rounded">
                    <p className="text-yellow-800">Please connect your wallet to claim revenue.</p>
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
                <button
                    type="submit"
                    disabled={loading || !isConnected}
                    className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                    {loading ? 'Claiming...' : 'Claim Revenue'}
                </button>
            </form>
            {result && result.explorerUrl && (
                <div className="mt-4 p-4 bg-green-100 rounded text-black">
                    <h2 className="text-lg font-semibold text-black">Success!</h2>
                    <p>Transaction Hash: {result.txHash}</p>
                    <p>
                        Claimed Tokens:{' '}
                        {result.claimedTokens.map(
                            (token: any, index: number) =>
                                `${index + 1}. Claimer: ${token.claimer}, Token: ${token.token}, Amount: ${token.amount}`
                        ).join('; ')}
                    </p>
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