import chains from 'chains'
import { LocalStorageKeys } from 'constants/localStorageKeys'
import { ChainInfoID } from 'types/enums'

export const getCurrentChainId = () => {
  const defaultChainId = chains[ChainInfoID.Osmosis1].id

  let chainId = defaultChainId

  if (window) {
    const subdomain = window.location.hostname.split('.')[0]

    switch (subdomain) {
      case 'osmosis':
        chainId = ChainInfoID.Osmosis1
        break

      case 'testnet-osmosis':
        chainId = ChainInfoID.OsmosisDevnet
        break

      case 'neutron':
        chainId = ChainInfoID.Neutron1
        break

      case 'testnet-neutron':
        chainId = ChainInfoID.Pion1
        break
    }

    if (chainId !== defaultChainId) return chainId
  }

  const localStorageChainId = localStorage.getItem(LocalStorageKeys.CURRENT_CHAIN_ID) as ChainInfoID
  if (localStorageChainId !== null) {
    switch (localStorageChainId) {
      case ChainInfoID.Osmosis1:
        chainId = ChainInfoID.Osmosis1
        break

      case ChainInfoID.OsmosisDevnet:
        chainId = ChainInfoID.OsmosisDevnet
        break

      case ChainInfoID.Neutron1:
        chainId = ChainInfoID.Neutron1
        break

      case ChainInfoID.Pion1:
        chainId = ChainInfoID.Pion1
        break
    }
  }

  return chainId
}
