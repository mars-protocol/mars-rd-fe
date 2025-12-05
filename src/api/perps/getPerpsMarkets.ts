const PERPS_MARKETS_URL =
  'https://raw.githubusercontent.com/mars-protocol/perps-markets/refs/heads/main/markets/neutron-1.json'

interface PerpsMarketData {
  chainId: string
  denom: string
  symbol: string
  icon: string
  description: string
  decimals: number
  priceUSD: number
  totalLiquidityUSD: number
  dayVolumeUSD: number
}

export default async function getPerpsMarkets(): Promise<Asset[]> {
  try {
    const response = await fetch(PERPS_MARKETS_URL)
    const data = (await response.json()) as PerpsMarketData[]

    return data.map((market) => ({
      chainId: market.chainId,
      denom: market.denom,
      symbol: market.symbol,
      icon: market.icon,
      description: market.description,
      decimals: market.decimals,
    }))
  } catch (error) {
    console.error('Could not fetch perps markets.', error)
    return []
  }
}
