import chains from 'chains'
import { LocalStorageKeys } from 'constants/localStorageKeys'
import useStore from 'store'

export default function useChainConfig() {
  const chainConfig = useStore((s) => s.chainConfig)

  const rpcEndpoint =
    localStorage.getItem(`${chainConfig.id}/${LocalStorageKeys.RPC_ENDPOINT}`) ??
    chains[chainConfig.id].endpoints.rpc
  const restEndpoint =
    localStorage.getItem(`${chainConfig.id}/${LocalStorageKeys.REST_ENDPOINT}`) ??
    chains[chainConfig.id].endpoints.rest

  return {
    ...chains[chainConfig.id],
    endpoints: {
      ...chains[chainConfig.id].endpoints,
      rpc: rpcEndpoint,
      rest: restEndpoint,
    },
  }
}
