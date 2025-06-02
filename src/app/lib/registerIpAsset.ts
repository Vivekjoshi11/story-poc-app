/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unused-vars */

// import crypto from "crypto";
// import { getStoryClient, publicClient } from "./storyClient";
// import { uploadFileToIpfs, uploadJSONToIpfs } from "./uploadToIpfs";
// import { keccak256, toHex } from "viem";
// import erc20Abi from "./erc20Abi.json"; // Import ERC-20 ABI

// export async function registerIpAssetSimple(imageFile: File) {
//   try {
//     console.log("Starting IP registration...");

//     if (!imageFile) {
//       throw new Error("Image file is required");
//     }

//     const { client, address, walletClient } = await getStoryClient();

//     if (!client) throw new Error("Story client not initialized");
//     if (!address) throw new Error("Wallet address not found");

//     console.log("Connected address:", address);

//     // Check native balance
//     const balance = await publicClient.getBalance({ address });
//     console.log("Account balance:", balance.toString());
//     if (balance === 0n) {
//       throw new Error("Insufficient balance. Please get AEN tokens from the faucet: https://faucet.aeneid.storyrpc.io/");
//     }

//     // Check fee token balance
//     const feeTokenAddress = "0x1514000000000000000000000000000000000000" as `0x${string}`; // Replace with actual token address
//     const feeTokenBalance = await publicClient.readContract({
//       address: feeTokenAddress,
//       abi: erc20Abi,
//       functionName: "balanceOf",
//       args: [address],
//     });
//     console.log("Fee token balance:", feeTokenBalance.toString());
//     if (feeTokenBalance === 0n) {
//       throw new Error("Insufficient fee token balance. Get AEN tokens from https://faucet.aeneid.storyrpc.io/");
//     }

//     // Approve fee token spend
//     const feeAmount = BigInt(1e18); // Replace with actual fee amount (check Story Protocol docs)
//     const spgNftContract = "0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc" as `0x${string}`;
//     console.log("Approving fee token spend...");
//     const approveTx = await walletClient.writeContract({
//       address: feeTokenAddress,
//       abi: erc20Abi,
//       functionName: "approve",
//       args: [spgNftContract, feeAmount],
//     });
//     const receipt = await publicClient.waitForTransactionReceipt({ hash: approveTx });
//     console.log("Approval successful:", approveTx);

//     console.log("Uploading image to IPFS...");
//     const imageIpfsUri = await uploadFileToIpfs(imageFile);
//     if (!imageIpfsUri) throw new Error("Failed to upload image to IPFS");

//     console.log("Image uploaded:", imageIpfsUri);

//     const nftMetadata = {
//       name: "My IP NFT",
//       description: "This NFT represents ownership of my IP asset",
//       image: imageIpfsUri,
//     };

//     const ipMetadata = {
//       title: "My IP Asset",
//       description: "Original creative content",
//       image: imageIpfsUri,
//       mediaUrl: imageIpfsUri,
//       mediaType: imageFile.type || "image/jpeg",
//       creators: [
//         {
//           name: "Creator",
//           address: address,
//           description: "Original creator",
//           contributionPercent: 100,
//         },
//       ],
//       createdAt: new Date().toISOString(),
//     };

//     console.log("Uploading metadata to IPFS...");
//     const nftMetadataUri = await uploadJSONToIpfs(nftMetadata);
//     const ipMetadataUri = await uploadJSONToIpfs(ipMetadata);

//     if (!nftMetadataUri || !ipMetadataUri) {
//       throw new Error("Failed to upload metadata to IPFS");
//     }

//     const nftMetadataHash = keccak256(toHex(JSON.stringify(nftMetadata)));
//     const ipMetadataHash = keccak256(toHex(JSON.stringify(ipMetadata)));

//     console.log("Parameters for mintAndRegisterIp:", {
//       spgNftContract,
//       ipMetadata: {
//         ipMetadataURI: ipMetadataUri,
//         ipMetadataHash,
//         nftMetadataURI: nftMetadataUri,
//         nftMetadataHash,
//       },
//     });

//     console.log("Registering IP Asset on Story Protocol...");
//     const response = await client.ipAsset.mintAndRegisterIp({
//       spgNftContract,
//       ipMetadata: {
//         ipMetadataURI: ipMetadataUri,
//         ipMetadataHash: ipMetadataHash as `0x${string}`,
//         nftMetadataURI: nftMetadataUri,
//         nftMetadataHash: nftMetadataHash as `0x${string}`,
//       },
//       txOptions: {
//         waitForTransaction: true,
//       },
//     });

//     if (!response) throw new Error("No response received from Story Protocol");

//     const txHash = response.txHash?.toString() || "N/A";
//     const ipId = response.ipId?.toString() || "N/A";
//     const tokenId = response.tokenId?.toString() || "N/A";

//     console.log("✅ IP Asset registered successfully!");
//     console.log(`📝 Transaction Hash: ${txHash}`);
//     console.log(`🆔 IP Asset ID: ${ipId}`);
//     console.log(`🎫 Token ID: ${tokenId}`);

//     if (ipId !== "N/A") {
//       console.log(`🔍 View on Explorer: https://aeneid.explorer.story.foundation/ipa/${ipId}`);
//     }

//     return {
//       success: true,
//       txHash,
//       ipId,
//       tokenId,
//       explorerUrl: ipId !== "N/A" ? `https://aeneid.explorer.story.foundation/ipa/${ipId}` : null,
//     };
//   } catch (error: any) {
//     console.error("❌ Error registering IP Asset:", error);
//     if (error.cause?.name === "ContractFunctionRevertedError") {
//       const receipt = await publicClient.getTransactionReceipt({
//         hash: error.cause.transactionHash,
//       });
//       console.error("Revert reason:", receipt.logs);
//     }
//     const errorMessage = error?.message || error?.toString() || "Unknown error";
//     throw new Error(errorMessage);
//   }
// }




// /* eslint-disable @typescript-eslint/no-unused-vars */

// import crypto from "crypto";
// import { getStoryClient, publicClient } from "./storyClient";
// import { uploadFileToIpfs, uploadJSONToIpfs } from "./uploadToIpfs";
// import { keccak256, toHex, parseEther } from "viem";
// import erc20Abi from "./erc20Abi.json";

// // WIP Token ABI - for wrapping IP to WIP
// const WIP_ABI = [
//   {
//     "inputs": [],
//     "name": "deposit",
//     "outputs": [],
//     "stateMutability": "payable",
//     "type": "function"
//   },
//   {
//     "inputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}],
//     "name": "withdraw",
//     "outputs": [],
//     "stateMutability": "nonpayable", 
//     "type": "function"
//   },
//   {
//     "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
//     "name": "balanceOf",
//     "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [{"internalType": "address", "name": "spender", "type": "address"}, {"internalType": "uint256", "name": "amount", "type": "uint256"}],
//     "name": "approve",
//     "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   }
// ];

// // Helper function to wrap IP to WIP
// async function wrapIPToWIP(amount: bigint, walletClient: any, userAddress: `0x${string}`) {
//   const WIP_CONTRACT_ADDRESS = "0x1514000000000000000000000000000000000000" as `0x${string}`;
  
//   try {
//     console.log(`Wrapping ${amount.toString()} IP to WIP...`);
    
//     // Call deposit function to wrap IP to WIP
//     const wrapTx = await walletClient.writeContract({
//       address: WIP_CONTRACT_ADDRESS,
//       abi: WIP_ABI,
//       functionName: "deposit",
//       value: amount, // Send IP tokens as value
//     });
    
//     // Wait for transaction confirmation
//     const wrapReceipt = await publicClient.waitForTransactionReceipt({ 
//       hash: wrapTx 
//     });
    
//     console.log("✅ Successfully wrapped IP to WIP:", wrapTx);
//     return wrapTx;
    
//   } catch (error) {
//     console.error("❌ Error wrapping IP to WIP:", error);
//     throw new Error(`Failed to wrap IP to WIP: ${error}`);
//   }
// }

// // Helper function to check WIP balance
// async function checkWIPBalance(userAddress: `0x${string}`) {
//   const WIP_CONTRACT_ADDRESS = "0x1514000000000000000000000000000000000000" as `0x${string}`;
  
//   try {
//     const wipBalance = await publicClient.readContract({
//       address: WIP_CONTRACT_ADDRESS,
//       abi: WIP_ABI,
//       functionName: "balanceOf",
//       args: [userAddress],
//     });
    
//     console.log("WIP Balance:", wipBalance.toString());
//     return wipBalance;
//   } catch (error) {
//     console.error("Error checking WIP balance:", error);
//     return 0n;
//   }
// }

// export async function registerIpAssetSimple(imageFile: File) {
//   try {
//     console.log("Starting IP registration...");

//     if (!imageFile) {
//       throw new Error("Image file is required");
//     }

//     const { client, address, walletClient } = await getStoryClient();

//     if (!client) throw new Error("Story client not initialized");
//     if (!address) throw new Error("Wallet address not found");

//     console.log("Connected address:", address);

//     // Check native IP balance
//     const balance = await publicClient.getBalance({ address });
//     console.log("IP Account balance:", balance.toString());
//     if (balance === 0n) {
//       throw new Error("Insufficient IP balance. Please get IP tokens from the faucet: https://faucet.story.foundation/");
//     }

//     // Check current WIP balance
//     const currentWIPBalance = await checkWIPBalance(address);
//     console.log("Current WIP balance:", currentWIPBalance.toString());

//     // Estimate required WIP for transaction (you may need to adjust this)
//     const requiredWIP = parseEther("0.1"); // 0.1 WIP for fees
    
//     // If WIP balance is insufficient, wrap some IP to WIP
//     if (currentWIPBalance < requiredWIP) {
//       console.log("Insufficient WIP balance, wrapping IP to WIP...");
//       const amountToWrap = parseEther("1.0"); // Wrap 1 IP to WIP
      
//       if (balance < amountToWrap) {
//         throw new Error("Insufficient IP balance to wrap to WIP");
//       }
      
//       await wrapIPToWIP(amountToWrap, walletClient, address);
//       console.log("✅ Successfully wrapped IP to WIP");
//     }

//     // Re-check WIP balance after wrapping
//     const updatedWIPBalance = await checkWIPBalance(address);
//     console.log("Updated WIP balance:", updatedWIPBalance.toString());

//     console.log("Uploading image to IPFS...");
//     const imageIpfsUri = await uploadFileToIpfs(imageFile);
//     if (!imageIpfsUri) throw new Error("Failed to upload image to IPFS");

//     console.log("Image uploaded:", imageIpfsUri);

//     const nftMetadata = {
//       name: "My IP NFT",
//       description: "This NFT represents ownership of my IP asset",
//       image: imageIpfsUri,
//     };

//     const ipMetadata = {
//       title: "My IP Asset",
//       description: "Original creative content",
//       image: imageIpfsUri,
//       mediaUrl: imageIpfsUri,
//       mediaType: imageFile.type || "image/jpeg",
//       creators: [
//         {
//           name: "Creator",
//           address: address,
//           description: "Original creator",
//           contributionPercent: 100,
//         },
//       ],
//       createdAt: new Date().toISOString(),
//     };

//     console.log("Uploading metadata to IPFS...");
//     const nftMetadataUri = await uploadJSONToIpfs(nftMetadata);
//     const ipMetadataUri = await uploadJSONToIpfs(ipMetadata);

//     if (!nftMetadataUri || !ipMetadataUri) {
//       throw new Error("Failed to upload metadata to IPFS");
//     }

//     const nftMetadataHash = keccak256(toHex(JSON.stringify(nftMetadata)));
//     const ipMetadataHash = keccak256(toHex(JSON.stringify(ipMetadata)));

//     // Use the correct SPG NFT contract address for Story Protocol testnet
//     const spgNftContract = "0x5dC881dDA4e4a8d312be3544AD13118D1a04Cb17" as `0x${string}`;

//     console.log("Parameters for mintAndRegisterIp:", {
//       spgNftContract,
//       ipMetadata: {
//         ipMetadataURI: ipMetadataUri,
//         ipMetadataHash,
//         nftMetadataURI: nftMetadataUri,
//         nftMetadataHash,
//       },
//     });

//     console.log("Registering IP Asset on Story Protocol...");
    
//     // The Story SDK should automatically handle WIP usage with enableAutoWrapIp
//     const response = await client.ipAsset.mintAndRegisterIp({
//       spgNftContract,
//       ipMetadata: {
//         ipMetadataURI: ipMetadataUri,
//         ipMetadataHash: ipMetadataHash as `0x${string}`,
//         nftMetadataURI: nftMetadataUri,
//         nftMetadataHash: nftMetadataHash as `0x${string}`,
//       },
//       txOptions: {
//         waitForTransaction: true,
//       },
//       // Enable automatic WIP handling
//       wipOptions: {
//         enableAutoWrapIp: true,
//         enableAutoApprove: true,
//         useMulticallWhenPossible: true,
//       },
//     });

//     if (!response) throw new Error("No response received from Story Protocol");

//     const txHash = response.txHash?.toString() || "N/A";
//     const ipId = response.ipId?.toString() || "N/A";
//     const tokenId = response.tokenId?.toString() || "N/A";

//     console.log("✅ IP Asset registered successfully!");
//     console.log(`📝 Transaction Hash: ${txHash}`);
//     console.log(`🆔 IP Asset ID: ${ipId}`);
//     console.log(`🎫 Token ID: ${tokenId}`);

//     if (ipId !== "N/A") {
//       console.log(`🔍 View on Explorer: https://aeneid.storyscan.io/ipa/${ipId}`);
//     }

//     return {
//       success: true,
//       txHash,
//       ipId,
//       tokenId,
//       explorerUrl: ipId !== "N/A" ? `https://aeneid.storyscan.io/ipa/${ipId}` : null,
//     };
//   } catch (error: any) {
//     console.error("❌ Error registering IP Asset:", error);
    
//     // Better error handling
//     if (error.cause?.name === "ContractFunctionRevertedError") {
//       try {
//         const receipt = await publicClient.getTransactionReceipt({
//           hash: error.cause.transactionHash,
//         });
//         console.error("Revert reason:", receipt.logs);
//       } catch (receiptError) {
//         console.error("Could not fetch transaction receipt:", receiptError);
//       }
//     }
    
//     const errorMessage = error?.message || error?.toString() || "Unknown error";
//     throw new Error(errorMessage);
//   }
// }

// // Export helper functions for standalone use
// export { wrapIPToWIP, checkWIPBalance };



/* eslint-disable @typescript-eslint/no-unused-vars */

// import crypto from "crypto";
// import { getStoryClient, publicClient } from "./storyClient";
// import { uploadFileToIpfs, uploadJSONToIpfs } from "./uploadToIpfs";
// import { keccak256, toHex, parseEther, formatEther } from "viem";
// import erc20Abi from "./erc20Abi.json";

// // WIP Token ABI - for wrapping IP to WIP
// const WIP_ABI = [
//   {
//     "inputs": [],
//     "name": "deposit",
//     "outputs": [],
//     "stateMutability": "payable",
//     "type": "function"
//   },
//   {
//     "inputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}],
//     "name": "withdraw",
//     "outputs": [],
//     "stateMutability": "nonpayable", 
//     "type": "function"
//   },
//   {
//     "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
//     "name": "balanceOf",
//     "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [{"internalType": "address", "name": "spender", "type": "address"}, {"internalType": "uint256", "name": "amount", "type": "uint256"}],
//     "name": "approve",
//     "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   }
// ];

// const WIP_CONTRACT_ADDRESS = "0x1514000000000000000000000000000000000000" as `0x${string}`;
// const SPG_NFT_CONTRACT = "0x5266215a00c31AaA2f2BB7b951Ea0028Ea8b4e37" as `0x${string}`;

// // Helper function to wrap IP to WIP with better error handling
// async function wrapIPToWIP(amount: bigint, walletClient: any, userAddress: `0x${string}`) {
//   try {
//     console.log(`Wrapping ${formatEther(amount)} IP to WIP...`);
    
//     // Check current IP balance
//     const ipBalance = await publicClient.getBalance({ address: userAddress });
//     if (ipBalance < amount) {
//       throw new Error(`Insufficient IP balance. Need ${formatEther(amount)} IP, have ${formatEther(ipBalance)} IP`);
//     }
    
//     // Call deposit function to wrap IP to WIP
//     const wrapTx = await walletClient.writeContract({
//       address: WIP_CONTRACT_ADDRESS,
//       abi: WIP_ABI,
//       functionName: "deposit",
//       value: amount, // Send IP tokens as value
//     });
    
//     console.log("Wrap transaction sent:", wrapTx);
    
//     // Wait for transaction confirmation
//     const wrapReceipt = await publicClient.waitForTransactionReceipt({ 
//       hash: wrapTx,
//       timeout: 60000 // 60 second timeout
//     });
    
//     console.log("✅ Successfully wrapped IP to WIP:", wrapTx);
//     return wrapTx;
    
//   } catch (error: any) {
//     console.error("❌ Error wrapping IP to WIP:", error);
//     throw new Error(`Failed to wrap IP to WIP: ${error.message || error}`);
//   }
// }

// // Helper function to check WIP balance
// async function checkWIPBalance(userAddress: `0x${string}`) {
//   try {
//     const wipBalance = await publicClient.readContract({
//       address: WIP_CONTRACT_ADDRESS,
//       abi: WIP_ABI,
//       functionName: "balanceOf",
//       args: [userAddress],
//     });
    
//     console.log("WIP Balance:", formatEther(wipBalance as bigint));
//     return wipBalance as bigint;
//   } catch (error) {
//     console.error("Error checking WIP balance:", error);
//     return 0n;
//   }
// }

// // Helper function to approve WIP spending
// async function approveWIP(spender: `0x${string}`, amount: bigint, walletClient: any) {
//   try {
//     console.log(`Approving ${formatEther(amount)} WIP for ${spender}...`);
    
//     const approveTx = await walletClient.writeContract({
//       address: WIP_CONTRACT_ADDRESS,
//       abi: WIP_ABI,
//       functionName: "approve",
//       args: [spender, amount],
//     });
    
//     console.log("Approval transaction sent:", approveTx);
    
//     const approveReceipt = await publicClient.waitForTransactionReceipt({ 
//       hash: approveTx,
//       timeout: 60000
//     });
    
//     console.log("✅ Successfully approved WIP spending:", approveTx);
//     return approveTx;
    
//   } catch (error: any) {
//     console.error("❌ Error approving WIP:", error);
//     throw new Error(`Failed to approve WIP: ${error.message || error}`);
//   }
// }

// export async function registerIpAssetSimple(imageFile: File) {
//   try {
//     console.log("Starting IP registration...");

//     if (!imageFile) {
//       throw new Error("Image file is required");
//     }

//     const { client, address, walletClient } = await getStoryClient();

//     if (!client) throw new Error("Story client not initialized");
//     if (!address) throw new Error("Wallet address not found");

//     console.log("Connected address:", address);

//     // Check native IP balance
//     const balance = await publicClient.getBalance({ address });
//     console.log("IP Account balance:", formatEther(balance));
    
//     if (balance === 0n) {
//       throw new Error("Insufficient IP balance. Please get IP tokens from the faucet: https://faucet.story.foundation/");
//     }

//     // Check current WIP balance
//     const currentWIPBalance = await checkWIPBalance(address);
//     console.log("Current WIP balance:", formatEther(currentWIPBalance));

//     // Since you have 6 WIP, we'll use a smaller amount for fees
//     const requiredWIP = parseEther("1.0"); // 1.0 WIP should be sufficient for mint fees
    
//     console.log(`You have ${formatEther(currentWIPBalance)} WIP available`);
    
//     // Check if we have enough WIP (you have 6 WIP, so this should pass)
//     if (currentWIPBalance < requiredWIP) {
//       throw new Error(`Insufficient WIP balance. Need ${formatEther(requiredWIP)} WIP, have ${formatEther(currentWIPBalance)} WIP`);
//     }

//     // Always approve WIP spending for the SPG contract - this is the key fix
//     console.log("Approving WIP spending for SPG contract...");
//     console.log(`Approving ${formatEther(requiredWIP)} WIP for contract ${SPG_NFT_CONTRACT}`);
    
//     try {
//       await approveWIP(SPG_NFT_CONTRACT, requiredWIP, walletClient);
//       console.log("✅ WIP approval successful");
      
//       // Wait for approval to be confirmed on blockchain
//       await new Promise(resolve => setTimeout(resolve, 3000));
//     } catch (approvalError: any) {
//       console.error("❌ WIP approval failed:", approvalError);
//       throw new Error(`Failed to approve WIP tokens: ${approvalError.message}`);
//     }

//     console.log("Uploading image to IPFS...");
//     const imageIpfsUri = await uploadFileToIpfs(imageFile);
//     if (!imageIpfsUri) throw new Error("Failed to upload image to IPFS");

//     console.log("Image uploaded:", imageIpfsUri);

//     const nftMetadata = {
//       name: "My IP NFT",
//       description: "This NFT represents ownership of my IP asset",
//       image: imageIpfsUri,
//     };

//     const ipMetadata = {
//       title: "My IP Asset",
//       description: "Original creative content",
//       image: imageIpfsUri,
//       mediaUrl: imageIpfsUri,
//       mediaType: imageFile.type || "image/jpeg",
//       creators: [
//         {
//           name: "Creator",
//           address: address,
//           description: "Original creator",
//           contributionPercent: 100,
//         },
//       ],
//       createdAt: new Date().toISOString(),
//     };

//     console.log("Uploading metadata to IPFS...");
//     const nftMetadataUri = await uploadJSONToIpfs(nftMetadata);
//     const ipMetadataUri = await uploadJSONToIpfs(ipMetadata);

//     if (!nftMetadataUri || !ipMetadataUri) {
//       throw new Error("Failed to upload metadata to IPFS");
//     }

//     const nftMetadataHash = keccak256(toHex(JSON.stringify(nftMetadata)));
//     const ipMetadataHash = keccak256(toHex(JSON.stringify(ipMetadata)));

//     console.log("Parameters for mintAndRegisterIp:", {
//       spgNftContract: SPG_NFT_CONTRACT,
//       ipMetadata: {
//         ipMetadataURI: ipMetadataUri,
//         ipMetadataHash,
//         nftMetadataURI: nftMetadataUri,
//         nftMetadataHash,
//       },
//     });

//     console.log("Registering IP Asset on Story Protocol...");
    
//     // Register IP Asset with explicit WIP configuration
//     const response = await client.ipAsset.mintAndRegisterIp({
//       spgNftContract: SPG_NFT_CONTRACT,
//       ipMetadata: {
//         ipMetadataURI: ipMetadataUri,
//         ipMetadataHash: ipMetadataHash as `0x${string}`,
//         nftMetadataURI: nftMetadataUri,
//         nftMetadataHash: nftMetadataHash as `0x${string}`,
//       },
//       txOptions: {
//         waitForTransaction: true,
//       },
//     });

//     if (!response) throw new Error("No response received from Story Protocol");

//     const txHash = response.txHash?.toString() || "N/A";
//     const ipId = response.ipId?.toString() || "N/A";
//     const tokenId = response.tokenId?.toString() || "N/A";

//     console.log("✅ IP Asset registered successfully!");
//     console.log(`📝 Transaction Hash: ${txHash}`);
//     console.log(`🆔 IP Asset ID: ${ipId}`);
//     console.log(`🎫 Token ID: ${tokenId}`);

//     if (ipId !== "N/A") {
//       console.log(`🔍 View on Explorer: https://aeneid.storyscan.io/ipa/${ipId}`);
//     }

//     return {
//       success: true,
//       txHash,
//       ipId,
//       tokenId,
//       explorerUrl: ipId !== "N/A" ? `https://aeneid.storyscan.io/ipa/${ipId}` : null,
//     };
//   } catch (error: any) {
//     console.error("❌ Error registering IP Asset:", error);
    
//     // Better error handling for contract reverts
//     if (error.cause?.name === "ContractFunctionRevertedError") {
//       console.error("Contract function reverted:", error.cause);
      
//       // Check if it's a mint fee issue
//       if (error.message?.includes("mintFeeToken")) {
//         throw new Error("Mint fee payment failed. Please ensure you have enough WIP tokens and they are properly approved for the SPG contract.");
//       }
//     }
    
//     // Check for specific error patterns
//     if (error.message?.includes("insufficient")) {
//       throw new Error(`Insufficient balance: ${error.message}`);
//     } else if (error.message?.includes("approved") || error.message?.includes("allowance")) {
//       throw new Error("Token approval failed. Please try again or check your WIP token balance.");
//     } 
//     else if (error.message?.includes("mintFeeToken")) {
//       throw new Error("Mint fee payment failed. Please ensure you have sufficient WIP tokens and proper approvals.");
//     }
    
//     const errorMessage = error?.message || error?.toString() || "Unknown error";
//     throw new Error(errorMessage);
//   }
// }

// // Export helper functions for standalone use
// export { wrapIPToWIP, checkWIPBalance, approveWIP };





// import crypto from "crypto";
// import { getStoryClient, publicClient } from "./storyClient";
// import { uploadFileToIpfs, uploadJSONToIpfs } from "./uploadToIpfs";
// import { keccak256, toHex, parseEther, formatEther } from "viem";
// import erc20Abi from "./erc20Abi.json";

// const WIP_ABI = [
//   {
//     "inputs": [],
//     "name": "deposit",
//     "outputs": [],
//     "stateMutability": "payable",
//     "type": "function"
//   },
//   {
//     "inputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}],
//     "name": "withdraw",
//     "outputs": [],
//     "stateMutability": "nonpayable", 
//     "type": "function"
//   },
//   {
//     "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
//     "name": "balanceOf",
//     "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [{"internalType": "address", "name": "spender", "type": "address"}, {"internalType": "uint256", "name": "amount", "type": "uint256"}],
//     "name": "approve",
//     "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   }
// ];

// const WIP_CONTRACT_ADDRESS = "0x1514000000000000000000000000000000000000" as `0x${string}`;
// // const WIP_CONTRACT_ADDRESS = "0xB83639aF55F03108091020b7c75a46e2eaAb4FfA" as `0x${string}`;
// const SPG_NFT_CONTRACT = "0x5266215a00c31AaA2f2BB7b951Ea0028Ea8b4e37" as `0x${string}`;

// async function checkWIPBalance(userAddress: `0x${string}`) {
//   try {
//     const wipBalance = await publicClient.readContract({
//       address: WIP_CONTRACT_ADDRESS,
//       abi: WIP_ABI,
//       functionName: "balanceOf",
//       args: [userAddress],
//     });
//     console.log("WIP Balance:", formatEther(wipBalance as bigint));
//     return wipBalance as bigint;
//   } catch (error) {
//     console.error("Error checking WIP balance:", error);
//     return 0n;
//   }
// }

// async function approveWIP(spender: `0x${string}`, amount: bigint, walletClient: any) {
//   try {
//     console.log(`Approving ${formatEther(amount)} WIP for ${spender}...`);
//     const approveTx = await walletClient.writeContract({
//       address: WIP_CONTRACT_ADDRESS,
//       abi: WIP_ABI,
//       functionName: "approve",
//       args: [spender, amount],
//     });
//     console.log("Approval transaction sent:", approveTx);
//     const approveReceipt = await publicClient.waitForTransactionReceipt({ 
//       hash: approveTx,
//       timeout: 60000
//     });
//     console.log("✅ Successfully approved WIP spending:", approveTx);
//     return approveTx;
//   } catch (error: any) {
//     console.error("❌ Error approving WIP:", error);
//     throw new Error(`Failed to approve WIP: ${error.message || error}`);
//   }
// }

// export async function registerIpAssetSimple(imageFile: File) {
//   try {
//     console.log("Starting IP registration...");

//     const { client, address, walletClient } = await getStoryClient();

//     if (!address) throw new Error("Wallet address not found");

//     console.log("Connected address:", address);

//     const balance = await publicClient.getBalance({ address });
//     console.log("IP Account balance:", formatEther(balance));

//     const currentWIPBalance = await checkWIPBalance(address);
//     console.log("Current WIP balance:", formatEther(currentWIPBalance));

//     const requiredWIP = parseEther("1.0");

//     if (currentWIPBalance < requiredWIP) {
//       throw new Error(`Insufficient WIP balance. Need ${formatEther(requiredWIP)} WIP, have ${formatEther(currentWIPBalance)} WIP`);
//     }

//     console.log("Approving WIP spending for SPG contract...");

//     const approveTx = await approveWIP(SPG_NFT_CONTRACT, requiredWIP, walletClient);
//     console.log("✅ WIP approval successful, tx:", approveTx);

//     await new Promise(resolve => setTimeout(resolve, 3000));

//     console.log("Uploading image to IPFS...");
//     const imageIpfsUri = await uploadFileToIpfs(imageFile);
//     if (!imageIpfsUri) throw new Error("Failed to upload image to IPFS");

//     const nftMetadata = {
//       name: "My IP NFT",
//       description: "This NFT represents ownership of my IP asset",
//       image: imageIpfsUri,
//     };

//     const ipMetadata = {
//       title: "My IP Asset",
//       description: "Original creative content",
//       image: imageIpfsUri,
//       mediaUrl: imageIpfsUri,
//       mediaType: imageFile.type || "image/jpeg",
//       creators: [{
//         name: "Creator",
//         address: address,
//         description: "Original creator",
//         contributionPercent: 100,
//       }],
//       createdAt: new Date().toISOString(),
//     };

//     console.log("Uploading metadata to IPFS...");
//     const nftMetadataUri = await uploadJSONToIpfs(nftMetadata);
//     const ipMetadataUri = await uploadJSONToIpfs(ipMetadata);

//     const nftMetadataHash = keccak256(toHex(JSON.stringify(nftMetadata)));
//     const ipMetadataHash = keccak256(toHex(JSON.stringify(ipMetadata)));

//     const response = await client.ipAsset.mintAndRegisterIp({
//       spgNftContract: SPG_NFT_CONTRACT,
//       ipMetadata: {
//         ipMetadataURI: ipMetadataUri,
//         ipMetadataHash: ipMetadataHash as `0x${string}`,
//         nftMetadataURI: nftMetadataUri,
//         nftMetadataHash: nftMetadataHash as `0x${string}`,
//       },
//       txOptions: { waitForTransaction: true },
//     });

//     const txHash = response.txHash?.toString() || "N/A";
//     const ipId = response.ipId?.toString() || "N/A";
//     const tokenId = response.tokenId?.toString() || "N/A";

//     console.log("✅ IP Asset registered successfully!");

//     return {
//       success: true,
//       approveTx,
//       registerTx: txHash,
//       ipId,
//       tokenId,
//       explorerUrl: ipId !== "N/A" ? `https://aeneid.storyscan.io/ipa/${ipId}` : null,
//     };
//   } catch (error: any) {
//     console.error("❌ Error registering IP Asset:", error);
//     throw new Error(error?.message || error?.toString() || "Unknown error");
//   }
// }

// export { checkWIPBalance, approveWIP };



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

    // Configure walletClient with the correct account (optional if MetaMask is working)
    const account = privateKeyToAccount("0x1c2f17a18a21e9a50100d7f87f412f2ad3f07dbd44dec8f82c02edf67f2568a3"); // TODO: Replace with your private key (store in .env)
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
    const feeTokenAddress = "0x1514000000000000000000000000000000000000" as `0x${string}`; // TODO: Replace with actual $WIP token address
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