/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { PinataSDK } from 'pinata-web3';

// const pinata = new PinataSDK({
//   pinataJwt: process.env.PINATA_JWT,
// });

// export async function uploadJSONToIPFS(jsonMetadata: any): Promise<string> {
//   try {
//     const { IpfsHash } = await pinata.upload.json(jsonMetadata);
//     return IpfsHash;
//   } catch (error) {
//     console.error('Error uploading JSON to IPFS:', error);
//     throw new Error('Failed to upload JSON to IPFS');
//   }
// }

import { PinataSDK } from 'pinata-web3';

const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT,
});

export async function uploadJSONToIPFS(jsonMetadata: any): Promise<string> {
    try {
        // Validate input JSON
        if (!jsonMetadata || typeof jsonMetadata !== 'object') {
            throw new Error('Invalid JSON metadata: Must be a valid object');
        }

        // Attempt to stringify JSON to catch serialization errors
        try {
            JSON.stringify(jsonMetadata);
        } catch (jsonError) {
            throw new Error(`Invalid JSON metadata`);
        }

        // Ensure PINATA_JWT is set
        if (!process.env.PINATA_JWT) {
            throw new Error('PINATA_JWT is not set in environment variables');
        }

        console.log('Uploading JSON to IPFS:', jsonMetadata);
        const { IpfsHash } = await pinata.upload.json(jsonMetadata);
        console.log('Uploaded JSON to IPFS. Hash:', IpfsHash);
        return IpfsHash;
    } catch (error: any) {
        console.error('Error uploading JSON to IPFS:', {
            message: error.message,
            stack: error.stack,
            details: error.details || 'No additional details',
        });
        throw new Error(`Failed to upload JSON to IPFS: ${error.message}`);
    }
}