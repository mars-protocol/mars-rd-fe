import { API_BASE_URLS } from 'constants/endpoints'
import { NETWORK } from 'types/enums'

export function getApiBaseUrl() {
  const networkType = process.env.NEXT_PUBLIC_NETWORK ?? NETWORK.TESTNET
  return networkType === NETWORK.MAINNET ? API_BASE_URLS.MAINNET : API_BASE_URLS.TESTNET
}
