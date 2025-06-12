/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';

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
      ipMetadataURI,
      ipMetadataHash,
      nftMetadataURI,
      nftMetadataHash,
      walletAddress,
    } = body;

    // Validate required fields
    if (!ipMetadataURI || !ipMetadataHash || !nftMetadataURI || !nftMetadataHash || !walletAddress) {
      throw new Error('Missing required fields in form data');
    }

    // Prepare response for client-side transaction
    const response = {
      success: true,
      ipMetadataURI,
      ipMetadataHash,
      nftMetadataURI,
      nftMetadataHash,
    };

    return NextResponse.json(serializeBigInt(response));
  } catch (error: any) {
    console.error('Error preparing derivative IP Asset registration:', {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { success: false, error: `Failed to prepare derivative IP Asset registration: ${error.message}` },
      { status: 500 }
    );
  }
}