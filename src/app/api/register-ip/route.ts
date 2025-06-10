/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { client } from '../../lib/config';
import { uploadJSONToIPFS } from '../../lib/uploadToIpfs';
import { createCommercialRemixTerms, SPGNFTContractAddress } from '../../lib/utils';
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
    const ipMetadata: IpMetadata = client.ipAsset.generateIpMetadata({
      title,
      description,
      createdAt,
      creators: [
        {
          name: creatorName,
          address: creatorAddress,
          contributionPercent: 100,
        },
      ],
      image: imageUrl,
      imageHash,
      mediaUrl,
      mediaHash,
      mediaType,
    });

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
    const ipIpfsHash = await uploadJSONToIPFS(ipMetadata);
    const ipHash = createHash('sha256').update(JSON.stringify(ipMetadata)).digest('hex');
    const nftIpfsHash = await uploadJSONToIPFS(nftMetadata);
    const nftHash = createHash('sha256').update(JSON.stringify(nftMetadata)).digest('hex');

    // 4. Register IP Asset
    const response = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
      spgNftContract: SPGNFTContractAddress,
      licenseTermsData: [
        {
          terms: createCommercialRemixTerms({ defaultMintingFee: 1, commercialRevShare: 5 }),
        },
      ],
      ipMetadata: {
        ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
        ipMetadataHash: `0x${ipHash}`,
        nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
        nftMetadataHash: `0x${nftHash}`,
      },
      txOptions: { waitForTransaction: true },
    });

    // Serialize response to handle BigInt
    const serializedResponse = serializeBigInt({
      success: true,
      txHash: response.txHash,
      ipId: response.ipId,
      licenseTermsIds: response.licenseTermsIds,
      explorerUrl: `${process.env.PROTOCOL_EXPLORER}/ipa/${response.ipId}`,
    });

    return NextResponse.json(serializedResponse);
  } catch (error) {
    console.error('Error registering IP Asset:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to register IP Asset' },
      { status: 500 }
    );
  }
}