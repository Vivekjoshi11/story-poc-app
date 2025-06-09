import { NextResponse } from 'next/server';
import { Address, toHex } from 'viem';
import { mintNFT } from '../../lib/mintNFT';
import { NFTContractAddress, RoyaltyPolicyLRP } from '../../lib/utils';
import { account, client } from '../../lib/config';
import { WIP_TOKEN_ADDRESS } from '@story-protocol/core-sdk';

interface RegisterRequestBody {
  ipMetadataURI: string;
  ipMetadataHash: string;
  nftMetadataHash: string;
  nftMetadataURI: string;
}

export async function POST(request: Request) {
  try {
    const body: RegisterRequestBody = await request.json();

    // Validate request body
    if (!body.ipMetadataURI || !body.ipMetadataHash || !body.nftMetadataHash || !body.nftMetadataURI) {
      return NextResponse.json({ error: 'Missing required metadata fields' }, { status: 400 });
    }

    const PARENT_IP_ID: Address = '0x641E638e8FCA4d4844F509630B34c9D524d40BE5';
    const PARENT_LICENSE_TERMS_ID: string = '96';

    // 1. Mint NFT and register derivative IP
    const childTokenId = await mintNFT(account.address, body.nftMetadataURI);
    const childIp = await client.ipAsset.registerDerivativeIp({
      nftContract: NFTContractAddress,
      tokenId: childTokenId!,
      derivData: {
        parentIpIds: [PARENT_IP_ID],
        licenseTermsIds: [PARENT_LICENSE_TERMS_ID],
      },
      ipMetadata: {
        ipMetadataURI: body.ipMetadataURI,
        ipMetadataHash: toHex(body.ipMetadataHash, { size: 32 }),
        nftMetadataHash: toHex(body.nftMetadataHash, { size: 32 }),
        nftMetadataURI: body.nftMetadataURI,
      },
      txOptions: { waitForTransaction: true },
    });

    // 2. Claim revenue for parent
    const parentClaimRevenue = await client.royalty.claimAllRevenue({
      ancestorIpId: PARENT_IP_ID,
      claimer: PARENT_IP_ID,
      childIpIds: [childIp.ipId as Address],
      royaltyPolicies: [RoyaltyPolicyLRP],
      currencyTokens: [WIP_TOKEN_ADDRESS],
    });

    return NextResponse.json({
      success: true,
      transactionHash: childIp.txHash,
      ipaId: childIp.ipId,
      parentClaimRevenue,
    });
  } catch (error) {
    console.error('Error registering derivative and claiming revenue:', error);
    return NextResponse.json({ error: 'Failed to register derivative or claim revenue' }, { status: 500 });
  }
}