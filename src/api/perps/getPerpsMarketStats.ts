export default async function getPerpsMarketStats() {
  try {
    const response = await fetch(
      `https://testnet-api.marsprotocol.io/v2/perps_overview?chain=neutron&days=7&product=creditmanager&response_type=market&market=untrn`,
    )
    const data = (await response.json()) as PerpsMarketOverview

    return data.market_overview
  } catch (error) {
    console.error('Could not fetch perps market data.', error)
    return null
  }
}
