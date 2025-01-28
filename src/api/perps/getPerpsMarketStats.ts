import { TIMEFRAME } from 'constants/timeframe'
import { getApiBaseUrl } from 'utils/api'

export default async function getPerpsMarketStats(
  market: string = 'untrn',
  timeframe: string = '30',
) {
  try {
    const baseUrl = getApiBaseUrl()
    const timeframeConfig = TIMEFRAME.find((t) => t.value === timeframe) || {
      granularity: 'day',
      value: Number(timeframe),
    }
    const url = new URL(
      `${baseUrl}/v2/perps_overview?chain=neutron&granularity=${timeframeConfig.granularity}&unit=${timeframeConfig.value}&market=${market}&response_type=market`,
    )
    const response = await fetch(url.toString())
    const data = (await response.json()) as PerpsMarketOverview

    return data.market_overview.data[0]
  } catch (error) {
    console.error('Could not fetch perps market data.', error)
    return null
  }
}
