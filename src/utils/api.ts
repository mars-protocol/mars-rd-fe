import { API_BASE_URLS } from 'constants/endpoints'
import { ChainInfoID, NETWORK } from 'types/enums'
import { getCurrentChainId } from 'utils/getCurrentChainId'

export function getApiBaseUrl() {
  const chainId = getCurrentChainId()
  const networkType = chainId === ChainInfoID.Pion1 ? NETWORK.TESTNET : NETWORK.MAINNET
  return networkType === NETWORK.MAINNET ? API_BASE_URLS.MAINNET : API_BASE_URLS.TESTNET
}
