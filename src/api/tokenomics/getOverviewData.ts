import { ChainInfoID } from 'types/enums'
import { getApiBaseUrl } from 'utils/api'
import { getChainName } from 'utils/getChainName'
import { getUrl } from 'utils/url'

export default async function getOverviewData(chainId: ChainInfoID, timeframe: string = '30') {
  try {
    const baseUrl = getApiBaseUrl()
    const chain = getChainName(chainId)

    const url = getUrl(
      baseUrl,
      `/v2/overview?chain=${chain}&days=${timeframe}&product=creditmanager`,
    )
    const response = await fetch(url)
    const data = (await response.json()) as Overview

    return data.data[0] as OverviewData
  } catch (error) {
    console.error('Could not fetch overview data.', error)
    return null
  }
}
