import { getApiBaseUrl } from 'utils/api'

export default async function getOverviewData(timeframe: string = '30', chain: string = 'neutron') {
  try {
    const baseUrl = getApiBaseUrl()
    const url = new URL(
      `${baseUrl}/v2/overview?chain=${chain}&days=${timeframe}&product=creditmanager`,
    )
    const response = await fetch(url.toString())
    const data = (await response.json()) as Overview

    return data.data as OverviewData
  } catch (error) {
    console.error('Could not fetch overview data.', error)
    return null
  }
}
