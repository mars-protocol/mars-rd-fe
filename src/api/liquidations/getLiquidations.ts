export default async function getLiquidations() {
  try {
    const response = await fetch(
      'https://api.marsprotocol.io/v1/liquidations/osmosis/creditmanager/1/200',
    )
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Could not fetch liquidations data.', error)
    return null
  }
}