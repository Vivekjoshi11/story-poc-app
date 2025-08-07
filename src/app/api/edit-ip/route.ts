// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { NextRequest, NextResponse } from 'next/server';
// import { uploadJSONToIPFS } from '../../lib/uploadToIpfs';
// import { createHash } from 'crypto';
// import { IpMetadata } from '@story-protocol/core-sdk';

// // Utility function to convert BigInt to string in an object
// function serializeBigInt(obj: any): any {
//   return JSON.parse(
//     JSON.stringify(obj, (key, value) =>
//       typeof value === 'bigint' ? value.toString() : value
//     )
//   );
// }

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const {
//       ipId,
//       title,
//       description,
//       createdAt,
//       creatorName,
//       creatorAddress,
//       imageUrl,
//       imageHash,
//       mediaUrl,
//       mediaHash,
//       mediaType,
//       nftName,
//       nftDescription,
//       sunoArtist,
//       artistId,
//       walletAddress,
//     } = body;

//     // Validate wallet address
//     if (!walletAddress || walletAddress.toLowerCase() !== creatorAddress.toLowerCase()) {
//       return NextResponse.json(
//         { success: false, error: 'Wallet address must match creator address' },
//         { status: 400 }
//       );
//     }

//     // 1. Generate IP Metadata
//     const ipMetadata: IpMetadata = {
//       title,
//       description,
//       createdAt: createdAt || '',
//       creators: [
//         {
//           name: creatorName || '',
//           address: creatorAddress,
//           contributionPercent: 100,
//         },
//       ],
//       media: mediaUrl
//         ? [
//             {
//               url: mediaUrl,
//               mimeType: mediaType || '',
//               name: '',
//             },
//           ]
//         : [],
//       image: imageUrl || '',
//     };

//     // 2. Generate NFT Metadata
//     const nftMetadata = {
//       name: nftName || '',
//       description: nftDescription || '',
//       image: imageUrl || '',
//       animation_url: mediaUrl || '',
//       attributes: [
//         { key: 'Suno Artist', value: sunoArtist || '' },
//         { key: 'Artist ID', value: artistId || '' },
//         { key: 'Source', value: 'Suno.com' },
//       ],
//     };

//     // 3. Upload Metadata to IPFS
//     const ipMetadataForIpfs = {
//       ...ipMetadata,
//       imageHash: imageHash || '',
//       media: mediaUrl
//         ? [
//             {
//               url: mediaUrl,
//               mimeType: mediaType || '',
//               hash: mediaHash || '',
//             },
//           ]
//         : [],
//       sunoArtist: sunoArtist || '',
//       artistId: artistId || '',
//     };
//     const ipIpfsHash = await uploadJSONToIPFS(ipMetadataForIpfs);
//     const ipHash = createHash('sha256').update(JSON.stringify(ipMetadataForIpfs)).digest('hex');

//     return NextResponse.json({
//       success: true,
//       metadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
//       metadataHash: `0x${ipHash}`,
//     });
//   } catch (error: any) {
//     console.error('Error preparing IP Asset update:', error);
//     return NextResponse.json(
//       { success: false, error: `Failed to prepare IP Asset update: ${error.message}` },
//       { status: 500 }
//     );
//   }
// }



/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { uploadJSONToIPFS } from '../../lib/uploadToIpfs';
import { createHash } from 'crypto';
import { IpMetadata, StoryClient } from '@story-protocol/core-sdk';
import { createStoryClient } from '../../lib/config';
import { JsonRpcProvider } from 'ethers';

// Admin wallet address
const ADMIN_ADDRESS = '0x056c3160301D70f4F8A6e0d8717F8Af3676D1669';

// Utility function to check if admin has permission to call setIpMetadata
async function hasSetMetadataPermission(client: StoryClient, ipId: string, walletAddress: string): Promise<boolean> {
  try {
    const setMetadataFunctionSelector = '0x8225ffcb'; // From error data
    const metadataModuleAddress = '0x6E81a25C99C6e8430aeC7353325EB138aFE5DC16'; // CoreMetadataModule
    const permission = await client.permission.checkPermission({
      ipId,
      signer: walletAddress,
      to: metadataModuleAddress,
      func: setMetadataFunctionSelector,
    });
    return permission === 1; // 1 = ALLOW
  } catch (err) {
    console.error('Error checking permission:', err);
    return false;
  }
}

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
      isAdminEdit = false, // New field to indicate admin edit
    } = body;

    // Validate wallet address - allow admin OR original creator
    if (!walletAddress) {
      return NextResponse.json(
        { success: false, error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Initialize StoryClient with a provider
    const provider = new JsonRpcProvider(
      process.env.ETHEREUM_PROVIDER_URL || 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID'
    );
    const client = createStoryClient({ provider });

    // If it's an admin edit, verify admin address and permissions
    if (isAdminEdit) {
      if (walletAddress.toLowerCase() !== ADMIN_ADDRESS.toLowerCase()) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized: Admin access required' },
          { status: 403 }
        );
      }
      // Check if admin has permission to call setIpMetadata
      const hasPermission = await hasSetMetadataPermission(client, ipId, walletAddress);
      if (!hasPermission) {
        return NextResponse.json(
          {
            success: false,
            error: 'Admin lacks permission to update IP metadata',
            needsPermissionGrant: true,
          },
          { status: 403 }
        );
      }
    } else {
      // Regular user edit - must match creator
      if (walletAddress.toLowerCase() !== creatorAddress.toLowerCase()) {
        return NextResponse.json(
          { success: false, error: 'Wallet address must match creator address' },
          { status: 400 }
        );
      }
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
    if (error.reason?.includes('0xb3e96921')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin role or permission required', needsPermissionGrant: true },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { success: false, error: `Failed to prepare IP Asset update: ${error.message}` },
      { status: 500 }
    );
  }
}