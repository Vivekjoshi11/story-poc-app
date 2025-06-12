/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { uploadJSONToIPFS } from '../../lib/uploadToIpfs';
import { createHash } from 'crypto';
import { IpMetadata } from '@story-protocol/core-sdk';

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
      ipId,
      title,
      description,
      createdAt,
      creatorName,
      creatorAddress,
      imageUrl,
      imageHash,
      mediaUrl,
      mediaHash,
      mediaType,
      nftName,
      nftDescription,
      sunoArtist,
      artistId,
      walletAddress,
    } = body;

    // Validate wallet address
    if (!walletAddress || walletAddress.toLowerCase() !== creatorAddress.toLowerCase()) {
      return NextResponse.json(
        { success: false, error: 'Wallet address must match creator address' },
        { status: 400 }
      );
    }

    // 1. Generate IP Metadata
    const ipMetadata: IpMetadata = {
      title,
      description,
      createdAt: createdAt || '',
      creators: [
        {
          name: creatorName || '',
          address: creatorAddress,
          contributionPercent: 100,
        },
      ],
      media: mediaUrl
        ? [
            {
              url: mediaUrl,
              mimeType: mediaType || '',
              name: '',
            },
          ]
        : [],
      image: imageUrl || '',
    };

    // 2. Generate NFT Metadata
    const nftMetadata = {
      name: nftName || '',
      description: nftDescription || '',
      image: imageUrl || '',
      animation_url: mediaUrl || '',
      attributes: [
        { key: 'Suno Artist', value: sunoArtist || '' },
        { key: 'Artist ID', value: artistId || '' },
        { key: 'Source', value: 'Suno.com' },
      ],
    };

    // 3. Upload Metadata to IPFS
    const ipMetadataForIpfs = {
      ...ipMetadata,
      imageHash: imageHash || '',
      media: mediaUrl
        ? [
            {
              url: mediaUrl,
              mimeType: mediaType || '',
              hash: mediaHash || '',
            },
          ]
        : [],
      sunoArtist: sunoArtist || '',
      artistId: artistId || '',
    };
    const ipIpfsHash = await uploadJSONToIPFS(ipMetadataForIpfs);
    const ipHash = createHash('sha256').update(JSON.stringify(ipMetadataForIpfs)).digest('hex');

    return NextResponse.json({
      success: true,
      metadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
      metadataHash: `0x${ipHash}`,
    });
  } catch (error: any) {
    console.error('Error preparing IP Asset update:', error);
    return NextResponse.json(
      { success: false, error: `Failed to prepare IP Asset update: ${error.message}` },
      { status: 500 }
    );
  }
}