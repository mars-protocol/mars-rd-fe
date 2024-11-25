import { PERPS_ASSETS } from 'constants/perps'
import { convertAstroportAssetsResponse } from 'utils/assets'

export default async function getDexAssets(chainConfig: ChainConfig) {
  const uri = new URL(chainConfig.endpoints.dexAssets)
  try {
    const assets = await fetch(uri.toString()).then(async (res) => {
      const data = (await res.json()) as AstroportAssetsCached

      if (chainConfig.perps) data.tokens.push(...PERPS_ASSETS)
      return convertAstroportAssetsResponse(data.tokens)
    })
    return assets
  } catch (e) {
    return []
  }
}
