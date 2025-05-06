import Neutron1 from 'chains/neutron/neutron-1'
import { MARS_DENOM } from 'constants/mars'
import { BN_ZERO } from 'constants/math'
import { BN } from 'utils/helpers'
import { getUrl } from 'utils/url'

export default async function getMarsTokenPrice() {
  const url = getUrl(Neutron1.endpoints.dexAssets, '')

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const marsToken = data.tokens.find((token: Token) => token.denom === MARS_DENOM)

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
