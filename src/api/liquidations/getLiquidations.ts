import { getApiBaseUrl } from 'utils/api'
import { getChainName } from 'utils/getChainName'
import { getCurrentChainId } from 'utils/getCurrentChainId'

export default async function getLiquidations(page = 1, pageSize = 25) {
  try {
    const chainId = getCurrentChainId()
    const baseUrl = getApiBaseUrl()
    const chain = getChainName(chainId)

    const url = new URL(
      `${baseUrl}/v2/liquidations?chain=${chain}&product=creditmanager&page=${page}&limit=${pageSize}&orders={"block_height":"desc"}`,
    )
    const response = await fetch(url.toString())
    const data = await response.json()

    return { data: data.data, total: data.total } as LiquidationsResponse
  } catch (error) {
    console.error('Could not fetch liquidations data.', error)
    return { data: [], total: 0 }
  }
}
