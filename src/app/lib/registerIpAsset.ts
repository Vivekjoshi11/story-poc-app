/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */




import crypto from "crypto";
import { getStoryClient, publicClient } from "./storyClient";
import { uploadFileToIpfs, uploadJSONToIpfs } from "./uploadToIpfs";
import { keccak256, toHex, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { aeneid } from "viem/chains";

// Standard ERC-20 ABI
const erc20Abi = [
  {
    constant: true,
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "success", type: "bool" }],
    type: "function",
  },
];

export async function registerIpAssetSimple(imageFile: File) {
  try {
    console.log("Starting IP registration...");

    if (!imageFile) {
      throw new Error("Image file is required");
    }

    const { client, address, walletClient } = await getStoryClient();

    if (!client) throw new Error("Story client not initialized");
    if (!address) throw new Error("Wallet address not found");
    if (!walletClient) throw new Error("Wallet client not initialized");

    console.log("Connected address:", address);

    const account = privateKeyToAccount("0x1c2f17a18a21e9a50100d7f87f412f2ad3f07dbd44dec8f82c02edf67f2568a3"); 
    const configuredWalletClient = createWalletClient({
      chain: aeneid,
      transport: http("https://aeneid.storyrpc.io/"),
      account,
    });

    // Check native balance (AEN for gas)
    const balance = await publicClient.getBalance({ address });
    console.log("IP Account balance:", balance.toString());
    if (balance < BigInt(1e16)) { // Require at least 0.01 AEN for gas
      throw new Error("Insufficient native balance. Get AEN tokens from https://faucet.aeneid.storyrpc.io/");
    }

    // Check $WIP balance (ERC-20 fee token)
    const feeTokenAddress = "0x1514000000000000000000000000000000000000" as `0x${string}`; 
    const spgNftContract = "0x5dC881dDA4e4a8d312be3544AD13118D1a04Cb17" as `0x${string}`;
    // const spgNftContract = "0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc" as `0x${string}`;
    const feeTokenBalance = await publicClient.readContract({
      address: feeTokenAddress,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [address],
    });
    console.log("WIP Balance:", feeTokenBalance.toString());
    if (feeTokenBalance === 0n) {
      throw new Error("Insufficient $WIP balance. Get tokens from https://faucet.story.foundation/");
    }

    // Approve $WIP spend
    const feeAmount = BigInt(1e18); // 1 $WIP (adjust based on contract requirements)
    console.log("Approving $WIP spend...");
    const approveTx = await configuredWalletClient.writeContract({
      address: feeTokenAddress,
      abi: erc20Abi,
      functionName: "approve",
      args: [spgNftContract, feeAmount],
      account,
    });
    const approveReceipt = await publicClient.waitForTransactionReceipt({ hash: approveTx });
    console.log("Approval successful:", approveTx);

    // Check updated $WIP balance after approval
    const updatedFeeTokenBalance = await publicClient.readContract({
      address: feeTokenAddress,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [address],
    });
    console.log("Updated WIP balance:", updatedFeeTokenBalance.toString());

    console.log("Uploading image to IPFS...");
    const imageIpfsUri = await uploadFileToIpfs(imageFile);
    if (!imageIpfsUri) throw new Error("Failed to upload image to IPFS");

    console.log("Image uploaded:", imageIpfsUri);

    const nftMetadata = {
      name: "My IP NFT",
      description: "This NFT represents ownership of my IP asset",
      image: imageIpfsUri,
    };

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

    console.log("Uploading metadata to IPFS...");
    const nftMetadataUri = await uploadJSONToIpfs(nftMetadata);
    const ipMetadataUri = await uploadJSONToIpfs(ipMetadata);

    if (!nftMetadataUri || !ipMetadataUri) {
      throw new Error("Failed to upload metadata to IPFS");
    }

    const nftMetadataHash = keccak256(toHex(JSON.stringify(nftMetadata)));
    const ipMetadataHash = keccak256(toHex(JSON.stringify(ipMetadata)));

    console.log("Parameters for mintAndRegisterIp:", {
      spgNftContract,
      ipMetadata: {
        ipMetadataURI: ipMetadataUri,
        ipMetadataHash,
        nftMetadataURI: nftMetadataUri,
        nftMetadataHash,
      },
      allowDuplicates: true,
    });

    // Simulate the transaction to debug
    try {
      console.log("Simulating mintAndRegisterIp...");
      await publicClient.simulateContract({
        address: "0x77319B4031e6eF1250907aa00018B8B1c67a244b", // IPAssetRegistry
        abi: client.ipAsset.abi,
        functionName: "mintAndRegisterIp",
        args: [
          spgNftContract,
          address,
          {
            ipMetadataURI: ipMetadataUri,
            ipMetadataHash,
            nftMetadataURI: nftMetadataUri,
            nftMetadataHash,
          },
          true,
        ],
        account,
      });
      console.log("Simulation successful");
    } catch (simError) {
      console.error("Simulation failed:", simError);
    }

    console.log("Registering IP Asset on Story Protocol...");
    const response = await client.ipAsset.mintAndRegisterIp({
      spgNftContract,
      ipMetadata: {
        ipMetadataURI: ipMetadataUri,
        ipMetadataHash: ipMetadataHash as `0x${string}`,
        nftMetadataURI: nftMetadataUri,
        nftMetadataHash: nftMetadataHash as `0x${string}`,
      },
      allowDuplicates: true,
      txOptions: {
        waitForTransaction: true,
        gas: BigInt(5000000), // Increased gas limit
      },
    }, { walletClient: configuredWalletClient });

    if (!response) throw new Error("No response received from Story Protocol");

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
      txHash,
      ipId,
      tokenId,
      explorerUrl: ipId !== "N/A" ? `https://aeneid.explorer.story.foundation/ipa/${ipId}` : null,
    };
  } catch (error: any) {
    console.error("❌ Error registering IP Asset:", error);
    // Only attempt to fetch receipt if a transaction hash exists
    if (error.cause?.name === "ContractFunctionRevertedError" && error.cause?.transactionHash) {
      try {
        const receipt = await publicClient.getTransactionReceipt({
          hash: error.cause.transactionHash,
        });
        console.error("Revert reason:", receipt.logs);
      } catch (receiptError) {
        console.error("Could not fetch transaction receipt:", receiptError);
      }
    }
    const errorMessage = error?.message || error?.toString() || "Unknown error";
    throw new Error(errorMessage);
  }
}