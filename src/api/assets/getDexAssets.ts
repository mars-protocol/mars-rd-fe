import { ChainInfoID } from 'types/enums'
import { convertAstroportAssetsResponse } from 'utils/assets'

// Essential asset data imports
import { neutronPerps } from 'data/assets/neutron-perps'
import { neutronTokens } from 'data/assets/neutron-tokens'
import { osmosisTokens } from 'data/assets/osmosis-tokens'

export default async function getDexAssets(chainConfig: ChainConfig) {
  try {
    let tokens: any[]

    // Load essential static data based on chain ID
    switch (chainConfig.id) {
      case ChainInfoID.Neutron1:
        tokens = [...neutronTokens.tokens]
        // Add perps assets for Neutron
        if (chainConfig.perps) {
          tokens.push(...neutronPerps)
        }
        break
      case ChainInfoID.Osmosis1:
        tokens = [...osmosisTokens.tokens]
        break
      default:
        console.warn(`No static asset data found for chain ${chainConfig.id}`)
        return []
    }

    return convertAstroportAssetsResponse(tokens)
  } catch (e) {
    console.error('Error loading static asset data:', e)
    return []
  }
}
