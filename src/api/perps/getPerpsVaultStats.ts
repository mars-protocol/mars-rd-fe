import { getApiBaseUrl } from 'utils/api'
import { getUrl } from 'utils/url'

export default async function getPerpsVaultStats(timeframe: string) {
  try {
    const baseUrl = getApiBaseUrl()
    const url = getUrl(baseUrl, `/v2/perps_vault_historical?chain=neutron&days=${timeframe}`)
    const response = await fetch(url)
    const data = (await response.json()) as VaultHistoricalData
    console.log(data, 'datadatadata')
    return data
  } catch (error) {
    console.error('Could not fetch perps vault historical data.', error)
    return { apy: [] } as VaultHistoricalData
  }
}
