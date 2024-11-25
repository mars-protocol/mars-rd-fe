import chains from 'chains'
import { LocalStorageKeys } from 'constants/localStorageKeys'
import { ChainInfoID } from 'types/enums'

export const getCurrentChainId = () => {
  const defaultChainId = chains[ChainInfoID.Osmosis1].id
  let chainId = defaultChainId
  const localStorageChainId = localStorage.getItem(LocalStorageKeys.CURRENT_CHAIN_ID) as ChainInfoID

  if (!localStorageChainId || localStorageChainId === null) {
    if (chainId !== defaultChainId) return chainId
  } else {
    switch (localStorageChainId) {
      case ChainInfoID.Osmosis1:
        chainId = ChainInfoID.Osmosis1
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
