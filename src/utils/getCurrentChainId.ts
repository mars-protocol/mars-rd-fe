import { LocalStorageKeys } from 'constants/localStorageKeys'
import { ChainInfoID } from 'types/enums'

export const getCurrentChainId = () => {
  const localStorageChainId = localStorage.getItem(LocalStorageKeys.CURRENT_CHAIN_ID) as ChainInfoID

  return localStorageChainId ?? ChainInfoID.Osmosis1
}
