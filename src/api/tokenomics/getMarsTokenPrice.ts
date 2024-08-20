import { MARS_DENOM } from 'constants/mars'
import { BN_ZERO } from 'constants/math'
import { BN } from 'utils/helpers'

export default async function getMarsTokenPrice(chain: string = 'osmosis-1') {
  try {
    const response = await fetch(`https://api.astroport.fi/api/tokens?chainId=${chain}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const marsToken = data.find((token: Token) => MARS_DENOM.includes(token.denom))

    if (!marsToken) {
      console.error('MARS token not found in the dataset.')
      return BN_ZERO
    }

    return BN(marsToken.priceUSD)
  } catch (e) {
    console.error('Error fetching Mars token price:', e)
    return BN_ZERO
  }
}
