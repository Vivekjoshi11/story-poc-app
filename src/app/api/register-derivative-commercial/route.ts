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
      parentIpId,
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
      mintingFee,
      commercialRevShare,
    } = body;

    // Validate required fields
    if (!parentIpId || !title || !description || !creatorAddress || !mediaUrl || !mediaType || !nftName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 1. Generate IP Metadata for the derivative
    const ipMetadata: IpMetadata = {
      title,
      description,
      createdAt: createdAt || Math.floor(Date.now() / 1000).toString(),
      creators: [
        {
          name: creatorName || 'Unknown Creator',
          address: creatorAddress,
          contributionPercent: 100,
        },
      ],
      media: [
        {
          url: mediaUrl,
          mimeType: mediaType,
          name: '',
        },
      ],
      image: imageUrl || '',
    };

    // 2. Generate NFT Metadata
    const nftMetadata = {
      name: nftName,
      description: nftDescription || description,
      image: imageUrl || '',
      animation_url: mediaUrl,
      attributes: [
        { key: 'Suno Artist', value: sunoArtist || 'Unknown' },
        { key: 'Artist ID', value: artistId || 'N/A' },
        { key: 'Source', value: 'Suno.com' },
        { key: 'Parent IP ID', value: parentIpId },
      ],
    };

    // 3. Upload Metadata to IPFS
    const ipMetadataForIpfs = {
      ...ipMetadata,
      imageHash: imageHash || '',
      media: [
        {
          url: mediaUrl,
          mimeType: mediaType,
          hash: mediaHash || '',
        },
      ],
    };
    const ipIpfsHash = await uploadJSONToIPFS(ipMetadataForIpfs);
    const ipHash = createHash('sha256').update(JSON.stringify(ipMetadataForIpfs)).digest('hex');
    const nftIpfsHash = await uploadJSONToIPFS(nftMetadata);
    const nftHash = createHash('sha256').update(JSON.stringify(nftMetadata)).digest('hex');

    // 4. Prepare commercial terms for the derivative
    const terms = createCommercialRemixTerms({
      defaultMintingFee: mintingFee || 1,
      commercialRevShare: commercialRevShare || 5,
    });

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
      parentIpId,
    });
  } catch (error: any) {
    console.error('Error preparing derivative IP Asset registration:', error);
    return NextResponse.json(
      { success: false, error: `Failed to prepare derivative IP Asset registration: ${error.message}` },
      { status: 500 }
    );
  }
}