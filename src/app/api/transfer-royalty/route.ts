/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { Address, isAddress } from 'viem';
import { convertRoyaltyPercentToTokens, SPGNFTContractAddress } from '../../lib/utils';
import { createStoryClient, networkInfo } from '../../lib/config';
import { metaMask } from 'wagmi/connectors';

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
    const { ipId, royaltyPercent, targetAddress } = body;

    // Validate input
    if (!ipId || !royaltyPercent || !targetAddress) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: ipId, royaltyPercent, targetAddress' },
        { status: 400 }
      );
    }

    // Validate ipId and targetAddress as valid Ethereum addresses
    if (!isAddress(ipId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid IP Asset ID: Must be a valid Ethereum address' },
        { status: 400 }
      );
    }
    if (!isAddress(targetAddress)) {
      return NextResponse.json(
        { success: false, error: 'Invalid target address: Must be a valid Ethereum address' },
        { status: 400 }
      );
    }

    // Validate royaltyPercent
    const parsedRoyaltyPercent = parseFloat(royaltyPercent);
    if (isNaN(parsedRoyaltyPercent) || parsedRoyaltyPercent < 0 || parsedRoyaltyPercent > 100) {
      return NextResponse.json(
        { success: false, error: 'Invalid royalty percent: Must be a number between 0 and 100' },
        { status: 400 }
      );
    }

    // Initialize StoryClient (server-side, no wallet needed)
    const client = createStoryClient(metaMask);

    // Get the Royalty Vault Address
    const royaltyVaultAddress = await client.royalty.getRoyaltyVaultAddress(ipId as Address);

    if (!royaltyVaultAddress || !isAddress(royaltyVaultAddress)) {
      return NextResponse.json(
        { success: false, error: 'Royalty vault address not found for the provided IP Asset ID' },
        { status: 404 }
      );
    }

    // Prepare token transfer data
    const tokenData = {
      address: royaltyVaultAddress,
      amount: convertRoyaltyPercentToTokens(parsedRoyaltyPercent),
      target: targetAddress,
    };

    // Serialize token data to handle BigInt
    const serializedTokenData = serializeBigInt(tokenData);

    return NextResponse.json({
      success: true,
      spgNftContract: SPGNFTContractAddress,
      tokenData: serializedTokenData,
      ipId,
    });
  } catch (error: any) {
    console.error('Error preparing royalty token transfer:', error);
    return NextResponse.json(
      { success: false, error: `Failed to prepare royalty token transfer: ${error.message}` },
      { status: 500 }
    );
  }
}