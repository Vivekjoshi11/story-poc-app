// testWipApproval.ts - Run this first to test if WIP approval is working
import { getStoryClient, publicClient } from "../lib/storyClient";
import { parseEther, formatEther } from "viem";

const WIP_CONTRACT_ADDRESS = "0x1514000000000000000000000000000000000000" as `0x${string}`;
// const WIP_CONTRACT_ADDRESS = "0xB83639aF55F03108091020b7c75a46e2eaAb4FfA" as `0x${string}`;
const SPG_NFT_CONTRACT = "0x5dC881dDA4e4a8d312be3544AD13118D1a04Cb17" as `0x${string}`;
// const SPG_NFT_CONTRACT = "0xc32A8a0FF3beDDDa58393d022aF433e78739FAbc" as `0x${string}`;

const WIP_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "spender", "type": "address"}, {"internalType": "uint256", "name": "amount", "type": "uint256"}],
    "name": "approve",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}, {"internalType": "address", "name": "spender", "type": "address"}],
    "name": "allowance",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

export async function testWIPApprovalAndBalance() {
  try {
    console.log("🔍 Testing WIP balance and approval...");
    
    const { address, walletClient } = await getStoryClient();
    
    if (!address) throw new Error("Wallet address not found");
    
    // 1. Check WIP balance
    const wipBalance = await publicClient.readContract({
      address: WIP_CONTRACT_ADDRESS,
      abi: WIP_ABI,
      functionName: "balanceOf",
      args: [address],
    });
    
    console.log(`💰 Your WIP Balance: ${formatEther(wipBalance as bigint)} WIP`);
    
    // 2. Check current allowance for SPG contract
    const currentAllowance = await publicClient.readContract({
      address: WIP_CONTRACT_ADDRESS,
      abi: WIP_ABI,
      functionName: "allowance",
      args: [address, SPG_NFT_CONTRACT],
    });
    
    console.log(`📋 Current Allowance for SPG: ${formatEther(currentAllowance as bigint)} WIP`);
    
    // 3. If allowance is less than 1 WIP, approve 2 WIP
    const requiredAmount = parseEther("1.0");
    const approveAmount = parseEther("2.0"); // Approve 2 WIP to be safe
    
    if ((currentAllowance as bigint) < requiredAmount) {
      console.log("🔄 Insufficient allowance, approving WIP...");
      
      const approveTx = await walletClient.writeContract({
        address: WIP_CONTRACT_ADDRESS,
        abi: WIP_ABI,
        functionName: "approve",
        args: [SPG_NFT_CONTRACT, approveAmount],
      });
      
      console.log("📤 Approval transaction sent:", approveTx);
      
      // Wait for transaction
      const receipt = await publicClient.waitForTransactionReceipt({ 
        hash: approveTx,
        timeout: 60000
      });
      
      console.log("✅ Approval confirmed! Transaction receipt:", receipt.status);
      
      // Verify new allowance
      const newAllowance = await publicClient.readContract({
        address: WIP_CONTRACT_ADDRESS,
        abi: WIP_ABI,
        functionName: "allowance",
        args: [address, SPG_NFT_CONTRACT],
      });
      
      console.log(`🎉 New Allowance: ${formatEther(newAllowance as bigint)} WIP`);
      
    } else {
      console.log("✅ Sufficient allowance already exists");
    }
    
    // 4. Final status
    const finalBalance = await publicClient.readContract({
      address: WIP_CONTRACT_ADDRESS,
      abi: WIP_ABI,
      functionName: "balanceOf",
      args: [address],
    });
    
    const finalAllowance = await publicClient.readContract({
      address: WIP_CONTRACT_ADDRESS,
      abi: WIP_ABI,
      functionName: "allowance",
      args: [address, SPG_NFT_CONTRACT],
    });
    
    console.log("\n📊 Final Status:");
    console.log(`💰 WIP Balance: ${formatEther(finalBalance as bigint)} WIP`);
    console.log(`📋 SPG Allowance: ${formatEther(finalAllowance as bigint)} WIP`);
    console.log(`✅ Ready for IP registration: ${(finalAllowance as bigint) >= requiredAmount ? 'YES' : 'NO'}`);
    
    return {
      success: true,
      balance: formatEther(finalBalance as bigint),
      allowance: formatEther(finalAllowance as bigint),
      readyForRegistration: (finalAllowance as bigint) >= requiredAmount
    };
    
  } catch (error: any) {
    console.error("❌ Error testing WIP approval:", error);
    throw new Error(`WIP approval test failed: ${error.message || error}`);
  }
}

// You can also export this function to check allowance without approving
export async function checkWIPAllowance() {
  try {
    const { address } = await getStoryClient();
    
    if (!address) throw new Error("Wallet address not found");
    
    const allowance = await publicClient.readContract({
      address: WIP_CONTRACT_ADDRESS,
      abi: WIP_ABI,
      functionName: "allowance",
      args: [address, SPG_NFT_CONTRACT],
    });
    
    console.log(`Current SPG Allowance: ${formatEther(allowance as bigint)} WIP`);
    return formatEther(allowance as bigint);
    
  } catch (error: any) {
    console.error("Error checking WIP allowance:", error);
    throw error;
  }
}