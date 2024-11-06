export default async function getOverviewData(days: number = 30, chain: string = 'neutron') {
  try {
    const response = await fetch(
      `https://api.marsprotocol.io/v1/overview?chain=${chain}&days=${days}`,
      // `https://api.marsprotocol.io/v2/overview?chain=osmosis&days=30&product=creditmanager`,
    )
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Could not fetch overview data.', error)
    return null
  }
}
