/* eslint-disable @typescript-eslint/no-unused-vars */

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { NextRequest, NextResponse } from 'next/server';
// import { client } from '../../lib/config';
// import { Address } from 'viem';

// // Utility function to convert BigInt to string in an object
// function serializeBigInt(obj: any): any {
//     return JSON.parse(
//         JSON.stringify(obj, (key, value) =>
//             typeof value === 'bigint' ? value.toString() : value
//         )
//     );
// }

// export async function POST(request: NextRequest) {
//     try {
//         const body = await request.json();
//         const { ipId, licenseTermsId } = body;

//         // Validate input
//         if (!ipId || !licenseTermsId) {
//             throw new Error('Missing required fields: ipId and licenseTermsId');
//         }
//         if (!/^0x[a-fA-F0-9]{40}$/.test(ipId)) {
//             throw new Error('Invalid IP ID format');
//         }
//         if (!/^\d+$/.test(licenseTermsId)) {
//             throw new Error('Invalid license terms ID format');
//         }

//         // Log input for debugging
//         console.log('Received form data:', { ipId, licenseTermsId });

//         // Mint License Tokens
//         const response = await client.license.mintLicenseTokens({
//             licenseTermsId: licenseTermsId,
//             licensorIpId: ipId as Address,
//             amount: 1,
//             maxMintingFee: BigInt(0), // Disabled
//             maxRevenueShare: 100, // Default
//             txOptions: { waitForTransaction: true },
//         });

//         // Ensure PROTOCOL_EXPLORER is defined
//         const protocolExplorer = process.env.PROTOCOL_EXPLORER || 'https://aeneid.explorer.story.foundation';
//         if (!process.env.PROTOCOL_EXPLORER) {
//             console.warn('PROTOCOL_EXPLORER not set in environment variables. Using fallback:', protocolExplorer);
//         }

//         // Serialize response to handle BigInt
//         const serializedResponse = serializeBigInt({
//             success: true,
//             txHash: response.txHash,
//             licenseTokenIds: response.licenseTokenIds,
//             explorerUrl: `${protocolExplorer}/tx/${response.txHash}`,
//         });

//         return NextResponse.json(serializedResponse);
//     } catch (error: any) {
//         console.error('Error minting license tokens:', {
//             message: error.message,
//             stack: error.stack,
//         });
//         return NextResponse.json(
//             { success: false, error: `Failed to mint license tokens: ${error.message}` },
//             { status: 500 }
//         );
//     }
// }



/* eslint-disable @typescript-eslint/no-explicit-any */
   import { NextRequest, NextResponse } from 'next/server';
   import { networkInfo, publicClient } from '../../lib/config';

   export async function POST(request: NextRequest) {
       try {
           const body = await request.json();
           const { ipId, licenseTermsId } = body;

           // Validate input
           if (!ipId || !licenseTermsId) {
               throw new Error('Missing required fields: ipId and licenseTermsId');
           }
           if (!/^0x[a-fA-F0-9]{40}$/.test(ipId)) {
               throw new Error('Invalid IP ID format');
           }
           if (!/^\d+$/.test(licenseTermsId)) {
               throw new Error('Invalid license terms ID format');
           }

           // Ensure PROTOCOL_EXPLORER is defined
           const protocolExplorer = process.env.PROTOCOL_EXPLORER || 'https://aeneid.explorer.story.foundation';
           if (!process.env.PROTOCOL_EXPLORER) {
               console.warn('PROTOCOL_EXPLORER not set in environment variables. Using fallback:', protocolExplorer);
           }

           // Return minimal response since transaction is handled client-side
           return NextResponse.json({
               success: true,
               protocolExplorer,
           });
       } catch (error: any) {
           console.error('Error processing request:', {
               message: error.message,
               stack: error.stack,
           });
           return NextResponse.json(
               { success: false, error: `Failed to process request: ${error.message}` },
               { status: 500 }
           );
       }
   }