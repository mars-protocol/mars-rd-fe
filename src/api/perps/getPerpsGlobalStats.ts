import { DEFAULT_PERPS_GLOBAL_DATA } from 'constants/chartData'
import { getApiBaseUrl } from 'utils/api'

export default async function getPerpsGlobalStats(timeframe: string = '7') {
  try {
    const baseUrl = getApiBaseUrl()
    const url = new URL(
      `${baseUrl}/v2/perps_overview?chain=neutron&days=${timeframe}&product=creditmanager&response_type=global`,
    )
    const response = await fetch(url.toString())
    const data = (await response.json()) as PerpsGlobalOverview

    return data.global_overview
  } catch (error) {
    console.error('Could not fetch perps global overview data.', error)
    return DEFAULT_PERPS_GLOBAL_DATA
  }
}
