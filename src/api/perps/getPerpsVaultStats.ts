import { getApiBaseUrl } from 'utils/api'
import { getUrl } from 'utils/url'

export default async function getPerpsVaultStats(timeframe: string) {
  try {
    if (timeframe === '12') {
      timeframe = '365'
    }
    const baseUrl = getApiBaseUrl()
    const url = getUrl(baseUrl, `/v2/perps_vault_historical?chain=neutron&days=${timeframe}`)
    const response = await fetch(url)
    const data = (await response.json()) as PerpsVaultApyData
    return data
  } catch (error) {
    console.error('Could not fetch perps vault apy data.', error)
    return { apy: [] } as PerpsVaultApyData
  }
}
