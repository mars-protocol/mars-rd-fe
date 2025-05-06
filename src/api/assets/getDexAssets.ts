import { convertAstroportAssetsResponse } from 'utils/assets'
import { getUrl } from 'utils/url'

export default async function getDexAssets(chainConfig: ChainConfig) {
  const uri = getUrl(chainConfig.endpoints.dexAssets, '')
  try {
    const assets = await fetch(uri.toString()).then(async (res) => {
      const data = (await res.json()) as AstroportAssetsCached

      if (chainConfig.perps) {
        try {
          const network = chainConfig.id.toLowerCase()

          const response = await fetch(
            `https://raw.githubusercontent.com/mars-protocol/perps-markets/main/markets/${network}.json`,
          )

          if (response.ok) {
            const perpAssets = await response.json()
            data.tokens.push(...perpAssets)
          }
        } catch (error) {
          console.error('Error fetching perp assets:', error)
        }
      }
      return convertAstroportAssetsResponse(data.tokens)
    })
    return assets
  } catch (e) {
    return []
  }
}
