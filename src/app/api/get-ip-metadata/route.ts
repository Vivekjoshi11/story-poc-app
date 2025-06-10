/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ipId = searchParams.get('ipId');

    if (!ipId) {
      return NextResponse.json(
        { success: false, error: 'IP Asset ID is required' },
        { status: 400 }
      );
    }

    // Placeholder: Fetch metadata from IPFS or Story Protocol
    // Replace with actual logic to query metadataURI from Story Protocol
    const metadataURI = `https://sepolia.infura.io/v3/6bdc9b51f0eb42b1a9cde9946407da4d`; // Replace with real URI
    const response = await fetch(metadataURI);
    const ipMetadata = await response.json();

    const nftMetadata = {
      name: ipMetadata.title || 'NFT Name',
      image: ipMetadata.image,
    };

    return NextResponse.json({
      success: true,
      ipMetadata,
      nftMetadata,
    });
  } catch (error) {
    console.error('Error fetching IP metadata:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch IP metadata' },
      { status: 500 }
    );
  }
}
