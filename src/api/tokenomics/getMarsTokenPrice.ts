import BigNumber from 'bignumber.js'

interface Token {
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

export default async function getMarsTokenPrice() {
  try {
    const response = await fetch('https://api.astroport.fi/api/tokens?chainId=neutron-1')
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const marsToken = data.find((token: Token) => token.symbol === 'MARS')

    if (!marsToken) {
      console.error('MARS token not found in the dataset.')
      return null
    }

    return new BigNumber(marsToken.priceUSD)
  } catch (e) {
    console.error('Error fetching Mars token price:', e)
    return null
  }
}
