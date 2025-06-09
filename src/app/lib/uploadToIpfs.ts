/* eslint-disable @typescript-eslint/no-explicit-any */
import { PinataSDK } from 'pinata-web3';

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
});

export async function uploadJSONToIPFS(jsonMetadata: any): Promise<string> {
  try {
    const { IpfsHash } = await pinata.upload.json(jsonMetadata);
    return IpfsHash;
  } catch (error) {
    console.error('Error uploading JSON to IPFS:', error);
    throw new Error('Failed to upload JSON to IPFS');
  }
}