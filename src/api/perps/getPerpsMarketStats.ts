export default async function getPerpsMarketStats(
  market: string = 'untrn',
  timeframe: string = '7',
) {
  try {
    const response = await fetch(
      `https://testnet-api.marsprotocol.io/v2/perps_overview?chain=neutron&days=${timeframe}&product=creditmanager&response_type=market&market=${market}`,
    )
    const data = (await response.json()) as PerpsMarketOverview

    console.log(data.market_overview.data, 'data response')
    return data.market_overview.data[0]
  } catch (error) {
    console.error('Could not fetch perps market data.', error)
    return null
  }
}
