import { getApiBaseUrl } from 'utils/api'

export default async function getLiquidations(chainId: string, page = 1, pageSize = 25) {
  try {
    const baseUrl = getApiBaseUrl()
    const url = new URL(
      `${baseUrl}/v2/liquidations?chain=${chainId}&product=creditmanager&page=${page}&limit=${pageSize}`,
    )

    const response = await fetch(url.toString())
    const data = await response.json()

    return data.data
  } catch (error) {
    console.error('Could not fetch liquidations data.', error)
    return null
  }
}
