export default async function getLiquidations(page = 1, pageSize = 25) {
  try {
    const response = await fetch(
      `https://api.marsprotocol.io/v1/liquidations/osmosis/creditmanager/${page}/${pageSize}`,
    )
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Could not fetch liquidations data.', error)
    return null
  }
}
