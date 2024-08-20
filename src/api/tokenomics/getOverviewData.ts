export default async function getOverviewData(days: number = 30, chain: string = 'neutron') {
  try {
    const response = await fetch(
      `https://api.marsprotocol.io/v1/overview?chain=${chain}&days=${days}`,
    )

    console.log(response, 'response')
    const data = await response.json()
    console.log(data, 'data')
    return data
  } catch (error) {
    console.error('Could not fetch overview data.', error)
    return null
  }
}
