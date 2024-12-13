import chains from 'chains'
import { DEFAULT_PERPS_GLOBAL_DATA } from 'constants/chartData'
import { TIMEFRAME } from 'constants/timeframe'
import { getApiBaseUrl } from 'utils/api'
import { getCurrentChainId } from 'utils/getCurrentChainId'

export default async function getPerpsGlobalStats(timeframe: string = '30') {
  const chainId = getCurrentChainId()
  const chainConfig = chains[chainId]
  if (!chainConfig.perps) return
  try {
    const baseUrl = getApiBaseUrl()
    const timeframeConfig = TIMEFRAME.find((t) => t.value === timeframe) || {
      granularity: 'day',
      value: Number(timeframe),
    }

    const url = new URL(
      `${baseUrl}/v2/perps_overview?chain=neutron&granularity=${timeframeConfig.granularity}&unit=${timeframeConfig.value}&response_type=global`,
    )
    const response = await fetch(url.toString())
    const data = (await response.json()) as PerpsGlobalOverview

    return data.global_overview
  } catch (error) {
    console.error('Could not fetch perps global overview data.', error)
    return DEFAULT_PERPS_GLOBAL_DATA
  }
}
