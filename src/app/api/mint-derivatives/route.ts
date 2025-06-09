/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { client } from '../../lib/config';
import { SPGNFTContractAddress, NonCommercialSocialRemixingTermsId } from '../../lib/utils';
import { Address, toHex } from 'viem';

// Utility function to convert BigInt to string in an object
function serializeBigInt(obj: any): any {
    return JSON.parse(
        JSON.stringify(obj, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        )
    );
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            parentIpId,
            licenseTermsId,
            ipMetadataUri,
            ipMetadataHash,
            nftMetadataUri,
            nftMetadataHash,
        } = body;

        // Validate input
        if (!parentIpId || !licenseTermsId || !ipMetadataUri || !ipMetadataHash || !nftMetadataUri || !nftMetadataHash) {
            throw new Error('Missing required fields');
        }
        if (!/^0x[a-fA-F0-9]{40}$/.test(parentIpId)) {
            throw new Error('Invalid Parent IP ID format');
        }
        if (!/^\d+$/.test(licenseTermsId)) {
            throw new Error('Invalid License Terms ID format');
        }
        if (!ipMetadataHash.startsWith('0x') || ipMetadataHash.length !== 66) {
            throw new Error('Invalid IP Metadata Hash format (must be 32 bytes hex with 0x prefix)');
        }
        if (!nftMetadataHash.startsWith('0x') || nftMetadataHash.length !== 66) {
            throw new Error('Invalid NFT Metadata Hash format (must be 32 bytes hex with 0x prefix)');
        }

        // Log input for debugging
        console.log('Received form data:', {
            parentIpId,
            licenseTermsId,
            ipMetadataUri,
            ipMetadataHash,
            nftMetadataUri,
            nftMetadataHash,
        });

        // Mint and Register Derivative IP Asset
        const childIp = await client.ipAsset.mintAndRegisterIpAndMakeDerivative({
            spgNftContract: SPGNFTContractAddress,
            derivData: {
                parentIpIds: [parentIpId as Address],
                licenseTermsIds: [licenseTermsId],
            },
            ipMetadata: {
                ipMetadataURI: ipMetadataUri,
                ipMetadataHash: toHex(ipMetadataHash, { size: 32 }),
                nftMetadataURI: nftMetadataUri,
                nftMetadataHash: toHex(nftMetadataHash, { size: 32 }),
            },
            txOptions: { waitForTransaction: true },
        });

        // Ensure PROTOCOL_EXPLORER is defined
        const protocolExplorer = process.env.PROTOCOL_EXPLORER || 'https://aeneid.explorer.story.foundation';
        if (!process.env.PROTOCOL_EXPLORER) {
            console.warn('PROTOCOL_EXPLORER not set in environment variables. Using fallback:', protocolExplorer);
        }

        // Serialize response to handle BigInt
        const serializedResponse = serializeBigInt({
            success: true,
            txHash: childIp.txHash,
            ipId: childIp.ipId,
            explorerUrl: `${protocolExplorer}/ipa/${childIp.ipId}`,
        });

        return NextResponse.json(serializedResponse);
    } catch (error: any) {
        console.error('Error minting derivative IP Asset:', {
            message: error.message,
            stack: error.stack,
        });
        return NextResponse.json(
            { success: false, error: `Failed to mint derivative IP Asset: ${error.message}` },
            { status: 500 }
        );
    }
}