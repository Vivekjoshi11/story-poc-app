/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { client } from '../../lib/config1';
import { uploadJSONToIPFS } from '../../lib/uploadToIpfs';
import { RoyaltyPolicyLRP, SPGNFTContractAddress } from '../../lib/utils';
import { WIP_TOKEN_ADDRESS } from '@story-protocol/core-sdk';
import { Address, toHex } from 'viem';
import { createHash } from 'crypto';

// Constants
const PARENT_IP_ID: Address = '0x641E638e8FCA4d4844F509630B34c9D524d40BE5';
const PARENT_LICENSE_TERMS_ID: string = '96';

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
            ipTitle, // Changed from title to match form data
            ipDescription, // Changed from description to match form data
            creatorName,
            creatorAddress,
            imageUrl,
            mediaUrl,
        } = body;

        // Log input for debugging
        console.log('Received form data:', { ipTitle, ipDescription, creatorName, creatorAddress, imageUrl, mediaUrl });

        // Validate required fields
        if (!ipTitle || !ipDescription || !creatorName || !creatorAddress || !imageUrl || !mediaUrl) {
            throw new Error('Missing required fields in form data');
        }

        // 1. Generate IP Metadata
        const ipMetadata = {
            title: ipTitle,
            description: ipDescription,
            creators: [
                {
                    name: creatorName,
                    address: creatorAddress,
                    contributionPercent: 100,
                },
            ],
            image: imageUrl,
            mediaUrl,
        };

        // 2. Generate NFT Metadata
        const nftMetadata = {
            name: ipTitle,
            description: ipDescription,
            image: imageUrl,
            animation_url: mediaUrl,
            attributes: [
                { key: 'Source', value: 'Derivative IP Asset' },
            ],
        };

        // Log metadata before uploading
        console.log('IP Metadata:', ipMetadata);
        console.log('NFT Metadata:', nftMetadata);

        // 3. Upload Metadata to IPFS
        const ipIpfsHash = await uploadJSONToIPFS(ipMetadata);
        const ipHash = createHash('sha256').update(JSON.stringify(ipMetadata)).digest(); // Get raw bytes
        const nftIpfsHash = await uploadJSONToIPFS(nftMetadata);
        const nftHash = createHash('sha256').update(JSON.stringify(nftMetadata)).digest(); // Get raw bytes

        // 4. Mint and Register Derivative IP Asset
        const childIp = await client.ipAsset.mintAndRegisterIpAndMakeDerivative({
            spgNftContract: SPGNFTContractAddress,
            derivData: {
                parentIpIds: [PARENT_IP_ID],
                licenseTermsIds: [PARENT_LICENSE_TERMS_ID],
            },
            ipMetadata: {
                ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
                ipMetadataHash: toHex(ipHash), // Use raw bytes, no size restriction
                nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
                nftMetadataHash: toHex(nftHash), // Use raw bytes, no size restriction
            },
            txOptions: { waitForTransaction: true },
        });

        // 5. Parent Claim Revenue
        const parentClaimRevenue = await client.royalty.claimAllRevenue({
            ancestorIpId: PARENT_IP_ID,
            claimer: PARENT_IP_ID,
            childIpIds: [childIp.ipId as Address],
            royaltyPolicies: [RoyaltyPolicyLRP],
            currencyTokens: [WIP_TOKEN_ADDRESS],
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
            parentClaimRevenue,
            explorerUrl: `${protocolExplorer}/ipa/${childIp.ipId}`,
        });

        return NextResponse.json(serializedResponse);
    } catch (error: any) {
        console.error('Error registering derivative IP Asset:', {
            message: error.message,
            stack: error.stack,
        });
        return NextResponse.json(
            { success: false, error: `Failed to register derivative IP Asset: ${error.message}` },
            { status: 500 }
        );
    }
}