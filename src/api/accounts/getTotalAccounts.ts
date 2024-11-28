import { getAccountNftQueryClient } from 'api/cosmwasm-client'

export default async function getTotalAccounts(chainConfig: ChainConfig): Promise<number> {
  try {
    const nftQueryClient = await getAccountNftQueryClient(chainConfig)
    const response = await nftQueryClient.numTokens()

    return response.count
  } catch {
    return new Promise((_, reject) => reject('No data'))
  }
}
