// app/lib/registerIpAssetSimple.ts
import crypto from "crypto";
import { getStoryClient } from "./storyClient";
import { uploadFileToIpfs, uploadJSONToIpfs } from "./uploadToIpfs";

export async function registerIpAssetSimple(imageFile: File) {
  try {
    console.log("Starting IP registration...");
    
    // Validate input
    if (!imageFile) {
      throw new Error("Image file is required");
    }
    
    const { client, address } = await getStoryClient();
    
    // Validate client and address
    if (!client) {
      throw new Error("Story client not initialized");
    }
    if (!address) {
      throw new Error("Wallet address not found");
    }

    console.log("Connected address:", address);

    // Upload the image to IPFS
    console.log("Uploading image to IPFS...");
    const imageIpfsUri = await uploadFileToIpfs(imageFile);
    
    if (!imageIpfsUri) {
      throw new Error("Failed to upload image to IPFS");
    }
    
    console.log("Image uploaded:", imageIpfsUri);

    // Create NFT metadata (ERC-721 standard)
    const nftMetadata = {
      name: "My IP NFT",
      description: "This NFT represents ownership of my IP asset",
      image: imageIpfsUri,
    };

    // Create IP metadata (Story Protocol standard)
    const ipMetadata = {
      title: "My IP Asset",
      description: "Original creative content",
      image: imageIpfsUri,
      mediaUrl: imageIpfsUri,
      mediaType: imageFile.type || "image/jpeg",
      creators: [
        {
          name: "Creator",
          address: address,
          description: "Original creator",
          contributionPercent: 100,
        },
      ],
      createdAt: new Date().toISOString(),
    };

    // Upload metadata to IPFS
    console.log("Uploading metadata to IPFS...");
    const nftMetadataUri = await uploadJSONToIpfs(nftMetadata);
    const ipMetadataUri = await uploadJSONToIpfs(ipMetadata);
    
    if (!nftMetadataUri || !ipMetadataUri) {
      throw new Error("Failed to upload metadata to IPFS");
    }

    // Create hashes with proper validation
    const nftMetadataString = JSON.stringify(nftMetadata);
    const ipMetadataString = JSON.stringify(ipMetadata);
    
    const nftMetadataHash = crypto
      .createHash("sha256")
      .update(nftMetadataString)
      .digest("hex");

    const ipMetadataHash = crypto
      .createHash("sha256")
      .update(ipMetadataString)
      .digest("hex");

    console.log("Registering IP Asset on Story Protocol...");
    console.log("Using SPG Contract:", "0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc");

    // Simple registration without license terms first
    const response = await client.ipAsset.mintAndRegisterIp({
      spgNftContract: "0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc", // Story's public SPG contract
      ipMetadata: {
        ipMetadataURI: ipMetadataUri,
        ipMetadataHash: `0x${ipMetadataHash}`,
        nftMetadataURI: nftMetadataUri,
        nftMetadataHash: `0x${nftMetadataHash}`,
      },
      txOptions: {
        waitForTransaction: true,
      },
    });

    // Validate response
    if (!response) {
      throw new Error("No response received from Story Protocol");
    }

    console.log("Full response:", response);

    // Safe property access with fallbacks
    const txHash = response.txHash?.toString() || "N/A";
    const ipId = response.ipId?.toString() || "N/A";
    const tokenId = response.tokenId?.toString() || "N/A";

    console.log("✅ IP Asset registered successfully!");
    console.log(`📝 Transaction Hash: ${txHash}`);
    console.log(`🆔 IP Asset ID: ${ipId}`);
    console.log(`🎫 Token ID: ${tokenId}`);
    
    if (ipId !== "N/A") {
      console.log(`🔍 View on Explorer: https://aeneid.explorer.story.foundation/ipa/${ipId}`);
    }

    return {
      success: true,
      txHash: txHash,
      ipId: ipId,
      tokenId: tokenId,
      explorerUrl: ipId !== "N/A" ? `https://aeneid.explorer.story.foundation/ipa/${ipId}` : null
    };

  } catch (error) {
    console.error("❌ Error registering IP Asset:", error);
    console.error("Error details:", {
      message: error?.message,
      stack: error?.stack,
      name: error?.name
    });

    // Better error handling
    const errorMessage = error?.message || error?.toString() || "Unknown error";
    
    if (errorMessage.includes('insufficient funds')) {
      throw new Error("Insufficient IP tokens for gas. Please get tokens from the faucet.");
    } else if (errorMessage.includes('user rejected')) {
      throw new Error("Transaction was rejected by user.");
    } else if (errorMessage.includes('network')) {
      throw new Error("Network error. Make sure you're connected to Aeneid testnet.");
    } else if (errorMessage.includes('undefined')) {
      throw new Error("Invalid response from Story Protocol. Please try again.");
    } else {
      throw new Error(`Registration failed: ${errorMessage}`);
    }
  }
}