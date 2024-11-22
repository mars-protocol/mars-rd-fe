export default async function getLiquidations(page = 1, pageSize = 25) {
  try {
    const response = await fetch(
      `https://api.marsprotocol.io/v2/liquidations?chain=osmosis&product=creditmanager&page=${page}&limit=${pageSize}&orders={"block_height":"desc"}`,
    )
    const data = await response.json()

    return data.data
  } catch (error) {
    console.error('Could not fetch liquidations data.', error)
    return null
  }
}
