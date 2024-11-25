import { getApiBaseUrl } from 'utils/api'

export default async function getPerpsMarketStats(
  market: string = 'untrn',
  timeframe: string = '7',
) {
  try {
    const baseUrl = getApiBaseUrl()
    const url = new URL(
      `${baseUrl}/v2/perps_overview?chain=neutron&days=${timeframe}&product=creditmanager&response_type=market&market=${market}`,
    )
    const response = await fetch(url.toString())
    const data = (await response.json()) as PerpsMarketOverview

    return data.market_overview.data[0]
  } catch (error) {
    console.error('Could not fetch perps market data.', error)
    return null
  }
}
