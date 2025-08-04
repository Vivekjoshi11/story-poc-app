/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Signer as AbstractSigner } from "@ethersproject/abstract-signer";
import {
  routerTokenApproval,
  swap,
} from "@piperx/sdk/dist/core";
import { routingExactInput } from "@piperx/sdk/dist/routing";

export const swapTokens = async (
  token1_address: string,
  token2_address: string,
  amount1: bigint,
  amount2Min: bigint,
  expire_time: bigint,
  signer: AbstractSigner,
  useNative: boolean
) => {
  try {
    // Fix: Use the correct destructuring based on the actual return type
    const routingResult = await routingExactInput(token1_address, token2_address, amount1);
    const { bestRoute, maxAmountOut } = routingResult;

    if (!bestRoute || bestRoute.length === 0) {
      throw new Error("No valid route found for swap.");
    }

    const approvalTx = await routerTokenApproval(
      token1_address,
      amount1,
      bestRoute,
      signer
    );

    if (approvalTx && typeof approvalTx.wait === "function") {
      await approvalTx.wait();
    }

    const tx = await swap(
      amount1,
      amount2Min,
      bestRoute,
      useNative,
      expire_time,
      signer
    );

    return tx;
  } catch (err) {
    console.error("Swap error:", err);
    throw err;
  }
};


// /* eslint-disable @typescript-eslint/no-explicit-any */
// import type { Signer as AbstractSigner } from "@ethersproject/abstract-signer";
// import {
//   routerTokenApproval,
//   swap,
// } from "@piperx/sdk/dist/core";
// import { routingExactInput } from "@piperx/sdk/dist/routing";

// export const swapTokens = async (
//   token1_address: string,
//   token2_address: string,
//   amount1: bigint,
//   expire_time: bigint,
//   signer: AbstractSigner,
//   useNative: boolean
// ) => {
//   try {
//     const { bestRoute, maxAmountOut } = await routingExactInput(token1_address, token2_address, amount1);

//     if (!bestRoute || bestRoute.length === 0 || !maxAmountOut) {
//       throw new Error("No valid route or estimated output found.");
//     }

//     // Log route for debugging
//     console.log("Best route:", bestRoute);
//     console.log("Estimated amount out:", maxAmountOut.toString());

//     // Apply 1% slippage
//     const slippage = 0.01;
//     const amount2Min = BigInt(Math.floor(Number(maxAmountOut) * (1 - slippage)));

//     // Approve token for swap
//     const approvalTx = await routerTokenApproval(
//       token1_address,
//       amount1,
//       bestRoute,
//       signer
//     );
//     if (approvalTx && typeof approvalTx.wait === "function") {
//       await approvalTx.wait();
//     }

//     const tx = await swap(
//       amount1,
//       amount2Min,
//       bestRoute,
//       useNative,
//       expire_time,
//       signer
//     );

//     return tx;
//   } catch (err) {
//     console.error("Swap error:", err);
//     throw err;
//   }
// };
