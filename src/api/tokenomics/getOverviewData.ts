export default async function getOverviewData() {
  try {
    const response = await fetch(' https://api.marsprotocol.io/v1/overview?chain=osmosis&days=1')
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Could not fetch overview data.', error)
    return null
  }
}
