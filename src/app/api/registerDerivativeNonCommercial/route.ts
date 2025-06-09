import { NextResponse } from 'next/server';
import { Address, toHex } from 'viem';
import { SPGNFTContractAddress, NonCommercialSocialRemixingTermsId } from '../../lib/utils';
import { client } from '../../lib/config';

// Define the expected request body structure
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

    // Mint and register IP asset as a derivative
    const childIp = await client.ipAsset.mintAndRegisterIpAndMakeDerivative({
      spgNftContract: SPGNFTContractAddress,
      derivData: {
        parentIpIds: [PARENT_IP_ID],
        licenseTermsIds: [NonCommercialSocialRemixingTermsId],
      },
      ipMetadata: {
        ipMetadataURI: body.ipMetadataURI,
        ipMetadataHash: toHex(body.ipMetadataHash, { size: 32 }),
        nftMetadataHash: toHex(body.nftMetadataHash, { size: 32 }),
        nftMetadataURI: body.nftMetadataURI,
      },
      txOptions: { waitForTransaction: true },
    });

    return NextResponse.json({
      success: true,
      transactionHash: childIp.txHash,
      ipaId: childIp.ipId,
    });
  } catch (error) {
    console.error('Error registering derivative:', error);
    return NextResponse.json({ error: 'Failed to register derivative' }, { status: 500 });
  }
}