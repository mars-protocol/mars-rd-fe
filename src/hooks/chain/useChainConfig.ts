import chains from 'chains'
import { LocalStorageKeys } from 'constants/localStorageKeys'
import useStore from 'store'

export default function useChainConfig() {
  const chainConfig = useStore((s) => s.chainConfig)
  const chainId = chainConfig.id

  const rpcEndpoint =
    localStorage.getItem(`${chainId}/${LocalStorageKeys.RPC_ENDPOINT}`) ??
    chains[chainId].endpoints.rpc
  const restEndpoint =
    localStorage.getItem(`${chainId}/${LocalStorageKeys.REST_ENDPOINT}`) ??
    chains[chainId].endpoints.rest

  return {
    ...chainConfig,
    endpoints: {
      ...chainConfig.endpoints,
      rpc: rpcEndpoint,
      rest: restEndpoint,
    },
  }
}
