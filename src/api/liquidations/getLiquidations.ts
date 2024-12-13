import { ChainInfoID } from 'types/enums'
import { getApiBaseUrl } from 'utils/api'
import { getCurrentChainId } from 'utils/getCurrentChainId'

export default async function getLiquidations(page = 1, pageSize = 25) {
  try {
    const chainId = getCurrentChainId()
    const baseUrl = getApiBaseUrl()

    if (chainId === ChainInfoID.Osmosis1) {
      return []
    }
    const url = new URL(
      `${baseUrl}/v2/liquidations?chain=neutron&product=creditmanager&page=${page}&limit=${pageSize}&orders={"block_height":"desc"}`,
    )
    const response = await fetch(url.toString())
    const data = await response.json()

    return data.data
  } catch (error) {
    console.error('Could not fetch liquidations data.', error)
    return []
  }
}
