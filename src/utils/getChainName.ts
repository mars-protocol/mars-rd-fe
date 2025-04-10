import { ChainInfoID } from 'types/enums'
import chains from 'chains'

export const getChainName = (chainId: ChainInfoID) => {
  const chainConfig = chains[chainId]
  if (chainConfig.isOsmosis) {
    return 'osmosis'
  } else {
    return 'neutron'
  }
}
