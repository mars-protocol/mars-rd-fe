import { DEFAULT_PERPS_GLOBAL_DATA } from 'constants/chartData'

export default async function getPerpsGlobalStats(timeframe: string = '7') {
  try {
    const response = await fetch(
      `https://testnet-api.marsprotocol.io/v2/perps_overview?chain=neutron&days=${timeframe}&product=creditmanager&response_type=global`,
    )
    const data = (await response.json()) as PerpsGlobalOverview

    return data.global_overview
  } catch (error) {
    console.error('Could not fetch perps global overview data.', error)
    return DEFAULT_PERPS_GLOBAL_DATA
  }
}
