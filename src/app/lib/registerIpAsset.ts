// // app/lib/registerIpAsset.ts
// import crypto from "crypto";
// import { getStoryClient } from "./storyClient";
// import { uploadFileToIpfs } from "./uploadToipfs";

// export async function registerIpAsset(imageFile: File) {
//   const client = await getStoryClient();

//   const imageIpfsUri = await uploadFileToIpfs(imageFile);

//   const metadata = {
//     name: "My NFT",
//     description: "Image IP NFT",
//     image: imageIpfsUri,
//   };

//   const ipMetadata = {
//     title: "Image IP",
//     description: "Original content",
//     image: imageIpfsUri,
//     creators: [
//       {
//         name: "Vivek",
//         address: client.account.address,
//         contributionPercent: 100,
//       },
//     ],
//     createdAt: `${Date.now()}`,
//   };

//   const metadataStr = JSON.stringify(metadata);
//   const ipMetadataStr = JSON.stringify(ipMetadata);

//   const nftMetadataHash = crypto.createHash("sha256").update(metadataStr).digest("hex");
//   const ipMetadataHash = crypto.createHash("sha256").update(ipMetadataStr).digest("hex");

//   const tx = await client.ipAsset.register({
//     nftMetadataURI: imageIpfsUri,
//     nftMetadataHash: `0x${nftMetadataHash}`,
//     ipMetadataURI: imageIpfsUri,
//     ipMetadataHash: `0x${ipMetadataHash}`,
//   });

//   console.log("TX Hash:", tx.hash);
//   await tx.wait();
//   console.log("✅ IP Registered!");
// }



// app/lib/registerIpAsset.ts
import crypto from "crypto";
import { getStoryClient } from "./storyClient";
import { uploadFileToIpfs } from "./uploadToipfs";

export async function registerIpAsset(imageFile: File) {
  const { client, address } = await getStoryClient();

  // Upload the image to IPFS
  const imageIpfsUri = await uploadFileToIpfs(imageFile);

  // Create metadata
  const metadata = {
    name: "My NFT",
    description: "Image IP NFT",
    image: imageIpfsUri,
  };

  const ipMetadata = {
    title: "Image IP",
    description: "Original content",
    image: imageIpfsUri,
    creators: [
      {
        name: "Vivek",
        address: address,
        contributionPercent: 100,
      },
    ],
    createdAt: `${Date.now()}`,
  };

  const metadataStr = JSON.stringify(metadata);
  const ipMetadataStr = JSON.stringify(ipMetadata);

  const nftMetadataHash = crypto.createHash("sha256").update(metadataStr).digest("hex");
  const ipMetadataHash = crypto.createHash("sha256").update(ipMetadataStr).digest("hex");

  // Mint + Register IP asset
  const tx = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
    spgNftContract: "0xYourNFTContractAddress", // Replace with actual NFT contract address
    allowDuplicates: true,
    licenseTermsData: [
      {
        terms: {
          commercialUse: true,
          derivativeWorks: true,
          royaltyPercentage: 5,
          // ... other license fields
        },
      },
    ],
    ipMetadata: {
      ipMetadataURI: imageIpfsUri,
      ipMetadataHash: `0x${ipMetadataHash}`,
      nftMetadataURI: imageIpfsUri,
      nftMetadataHash: `0x${nftMetadataHash}`,
    },
  });

  console.log("Transaction:", tx);
}
