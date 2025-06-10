/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { client } from '../../lib/config';
import { uploadJSONToIPFS } from '../../lib/uploadToIpfs';
import { createHash } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ipId, title, description, imageUrl, nftName } = body;

    // Prepare IP metadata
    const ipMetadata = {
      title,
      description,
      image: imageUrl,
    };

    // Prepare NFT metadata
    const nftMetadata = {
      name: nftName,
      image: imageUrl,
    };

    // Upload to IPFS
    const ipIpfsHash = await uploadJSONToIPFS(ipMetadata);
    const ipHash = createHash('sha256').update(JSON.stringify(ipMetadata)).digest('hex');

    // Update IP metadata using SDK
    const response = await client.ipAccount.setIpMetadata({
      ipId,
      metadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
      metadataHash: `0x${ipHash}`,
    });

    return NextResponse.json({
      success: true,
      txHash: response.txHash,
    });
  } catch (error) {
    console.error('Error updating IP Asset:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update IP Asset' },
      { status: 500 }
    );
  }
}

