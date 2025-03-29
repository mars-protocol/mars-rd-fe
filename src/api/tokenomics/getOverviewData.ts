import { getApiBaseUrl } from 'utils/api'
import { getChainName } from 'utils/getChainName'
import { getCurrentChainId } from 'utils/getCurrentChainId'

export default async function getOverviewData(timeframe: string = '30') {
  try {
    const chainId = getCurrentChainId()
    const baseUrl = getApiBaseUrl()
    const chain = getChainName(chainId)

    const url = new URL(
      `${baseUrl}/v2/overview?chain=${chain}&days=${timeframe}&product=creditmanager`,
    )
    const response = await fetch(url.toString())
    const data = (await response.json()) as Overview
    return data.data[0] as OverviewData
  } catch (error) {
    console.error('Could not fetch overview data.', error)
    return null
  }
}
