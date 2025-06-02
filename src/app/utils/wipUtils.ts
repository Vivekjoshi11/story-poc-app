/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/wipUtils.ts
import { publicClient } from "../lib/storyClient";
import { parseEther, formatEther } from "viem";

const WIP_CONTRACT_ADDRESS = "0x1514000000000000000000000000000000000000" as `0x${string}`;
// const WIP_CONTRACT_ADDRESS = "0xB83639aF55F03108091020b7c75a46e2eaAb4FfA" as `0x${string}`;

const WIP_ABI = [
  {
    "inputs": [],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable", 
    "type": "function"
  },
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
  }
];

export class WIPManager {
  
  // Check both IP and WIP balances
  static async getBalances(userAddress: `0x${string}`) {
    try {
      // Get native IP balance
      const ipBalance = await publicClient.getBalance({ address: userAddress });
      
      // Get WIP balance
      const wipBalance = await publicClient.readContract({
        address: WIP_CONTRACT_ADDRESS,
        abi: WIP_ABI,
        functionName: "balanceOf",
        args: [userAddress],
      });

      return {
        ip: {
          raw: ipBalance,
          formatted: formatEther(ipBalance)
        },
        wip: {
          raw: wipBalance,
          formatted: formatEther(wipBalance as bigint)
        }
      };
    } catch (error) {
      console.error("Error getting balances:", error);
      throw error;
    }
  }

  // Wrap IP to WIP
  static async wrapIP(amount: string, walletClient: any) {
    try {
      const amountWei = parseEther(amount);
      
      console.log(`Wrapping ${amount} IP to WIP...`);
      
      const txHash = await walletClient.writeContract({
        address: WIP_CONTRACT_ADDRESS,
        abi: WIP_ABI,
        functionName: "deposit",
        value: amountWei,
      });
      
      // Wait for confirmation
      const receipt = await publicClient.waitForTransactionReceipt({ 
        hash: txHash 
      });
      
      console.log("✅ IP wrapped to WIP successfully:", txHash);
      return { txHash, receipt };
      
    } catch (error) {
      console.error("❌ Error wrapping IP to WIP:", error);
      throw error;
    }
  }

  // Unwrap WIP to IP
  static async unwrapWIP(amount: string, walletClient: any) {
    try {
      const amountWei = parseEther(amount);
      
      console.log(`Unwrapping ${amount} WIP to IP...`);
      
      const txHash = await walletClient.writeContract({
        address: WIP_CONTRACT_ADDRESS,
        abi: WIP_ABI,
        functionName: "withdraw",
        args: [amountWei],
      });
      
      const receipt = await publicClient.waitForTransactionReceipt({ 
        hash: txHash 
      });
      
      console.log("✅ WIP unwrapped to IP successfully:", txHash);
      return { txHash, receipt };
      
    } catch (error) {
      console.error("❌ Error unwrapping WIP to IP:", error);
      throw error;
    }
  }

  // Approve WIP spending
  static async approveWIP(spender: `0x${string}`, amount: string, walletClient: any) {
    try {
      const amountWei = parseEther(amount);
      
      const txHash = await walletClient.writeContract({
        address: WIP_CONTRACT_ADDRESS,
        abi: WIP_ABI,
        functionName: "approve",
        args: [spender, amountWei],
      });
      
      const receipt = await publicClient.waitForTransactionReceipt({ 
        hash: txHash 
      });
      
      console.log("✅ WIP approval successful:", txHash);
      return { txHash, receipt };
      
    } catch (error) {
      console.error("❌ Error approving WIP:", error);
      throw error;
    }
  }

  // Ensure sufficient WIP balance (auto-wrap if needed)
  static async ensureSufficientWIP(
    requiredAmount: string, 
    userAddress: `0x${string}`, 
    walletClient: any
  ) {
    try {
      const requiredWei = parseEther(requiredAmount);
      const balances = await this.getBalances(userAddress);
      
      console.log(`Required WIP: ${requiredAmount}`);
      console.log(`Current WIP: ${balances.wip.formatted}`);
      
      // Check if we have enough WIP
      if (balances.wip.raw >= requiredWei) {
        console.log("✅ Sufficient WIP balance");
        return true;
      }
      
      // Calculate how much more WIP we need
      const deficit = requiredWei - balances.wip.raw;
      const deficitFormatted = formatEther(deficit);
      
      console.log(`Need ${deficitFormatted} more WIP`);
      
      // Check if we have enough IP to wrap
      if (balances.ip.raw < deficit) {
        throw new Error(
          `Insufficient IP balance to wrap. Need ${deficitFormatted} IP, but only have ${balances.ip.formatted} IP`
        );
      }
      
      // Wrap the required amount (plus a little extra for buffer)
      const wrapAmount = formatEther(deficit + parseEther("0.1")); // Add 0.1 IP buffer
      
      console.log(`Auto-wrapping ${wrapAmount} IP to WIP...`);
      await this.wrapIP(wrapAmount, walletClient);
      
      console.log("✅ Successfully ensured sufficient WIP balance");
      return true;
      
    } catch (error) {
      console.error("❌ Error ensuring sufficient WIP:", error);
      throw error;
    }
  }
}

export default WIPManager;