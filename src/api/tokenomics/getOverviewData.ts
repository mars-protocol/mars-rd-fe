export default async function getOverviewData(timeframe: string = '30', chain: string = 'neutron') {
  try {
    const response = await fetch(
      `https://testnet-api.marsprotocol.io/v2/overview?chain=${chain}&days=${timeframe}&product=creditmanager`,
    )
    const data = (await response.json()) as Overview

    return data.data as OverviewData
  } catch (error) {
    console.error('Could not fetch overview data.', error)
    return null
  }
}
