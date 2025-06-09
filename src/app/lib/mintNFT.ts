import { Address } from 'viem'
import { NFTContractAddress } from '../lib/utils'
import { publicClient, walletClient, account } from '../lib/config'
import { defaultNftContractAbi } from '../lib/abi/defaultNftContractAbi'

export async function mintNFT(to: Address, uri: string): Promise<number | undefined> {
    console.log('Minting a new NFT...')

    const { request } = await publicClient.simulateContract({
        address: NFTContractAddress,
        functionName: 'mintNFT',
        args: [to, uri],
        abi: defaultNftContractAbi,
    })
    const hash = await walletClient.writeContract({ ...request, account: account })
    const { logs } = await publicClient.waitForTransactionReceipt({
        hash,
    })
    if (logs[0].topics[3]) {
        return parseInt(logs[0].topics[3], 16)
    }
}
