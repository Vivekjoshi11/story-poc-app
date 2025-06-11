/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { uploadJSONToIPFS } from '../../lib/uploadToIpfs';
import { createCommercialRemixTerms, SPGNFTContractAddress } from '../../lib/utils';
import { createHash } from 'crypto';
import { IpMetadata } from '@story-protocol/core-sdk';
import { networkInfo } from '../../lib/config';

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
    } = body;

    // 1. Generate IP Metadata
    const ipMetadata: IpMetadata = {
      title,
      description,
      createdAt: createdAt, // Keep as string to match IpMetadata type
      creators: [
        {
          name: creatorName,
          address: creatorAddress,
          contributionPercent: 100,
        },
      ],
      media: [
        {
          url: mediaUrl,
          mimeType: mediaType,
          name: ''
        },
      ],
      image: imageUrl, // Use URL string directly
    };

    // 2. Generate NFT Metadata
    const nftMetadata = {
      name: nftName,
      description: nftDescription,
      image: imageUrl,
      animation_url: mediaUrl,
      attributes: [
        { key: 'Suno Artist', value: sunoArtist },
        { key: 'Artist ID', value: artistId },
        { key: 'Source', value: 'Suno.com' },
      ],
    };

    // 3. Upload Metadata to IPFS
    const ipMetadataForIpfs = {
      ...ipMetadata,
      imageHash, // Include hashes in IPFS metadata
      media: [
        {
          url: mediaUrl,
          mimeType: mediaType,
          hash: mediaHash,
        },
      ],
    };
    const ipIpfsHash = await uploadJSONToIPFS(ipMetadataForIpfs);
    const ipHash = createHash('sha256').update(JSON.stringify(ipMetadataForIpfs)).digest('hex');
    const nftIpfsHash = await uploadJSONToIPFS(nftMetadata);
    const nftHash = createHash('sha256').update(JSON.stringify(nftMetadata)).digest('hex');

    // 4. Prepare transaction data for client-side execution
    const terms = createCommercialRemixTerms({ defaultMintingFee: 1, commercialRevShare: 5 });

    // Serialize terms to handle BigInt values
    const serializedTerms = serializeBigInt(terms);

    return NextResponse.json({
      success: true,
      spgNftContract: SPGNFTContractAddress,
      terms: serializedTerms,
      ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
      ipMetadataHash: `0x${ipHash}`,
      nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
      nftMetadataHash: `0x${nftHash}`,
    });
  } catch (error: any) {
    console.error('Error preparing IP Asset registration:', error);
    return NextResponse.json(
      { success: false, error: `Failed to prepare IP Asset registration: ${error.message}` },
      { status: 500 }
    );
  }
}