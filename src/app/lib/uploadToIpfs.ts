// // app/lib/uploadToIpfs.ts
// import { PinataSDK } from "pinata-web3";

// const pinata = new PinataSDK({
//   pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT!,
// });

// export async function uploadFileToIpfs(file: File): Promise<string> {
//   const result = await pinata.pinFile(file);
//   return `ipfs://${result.IpfsHash}`;
// }


// lib/uploadToIpfs.ts
import { PinataSDK } from 'pinata';

const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT!,
  pinataGateway: 'emerald-obliged-roundworm-736.mypinata.cloud', // Replace with your actual gateway
});

export async function uploadFileToIpfs(file: File): Promise<string> {
  const result = await pinata.upload.public.file(file);
  return `ipfs://${result.IpfsHash}`;
}
