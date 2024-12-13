import chains from 'chains'
import { LocalStorageKeys } from 'constants/localStorageKeys'
import useLocalStorage from 'hooks/localStorage/useLocalStorage'
import { ChainInfoID } from 'types/enums'

export default function useChainConfig() {
  const [chainId] = useLocalStorage(LocalStorageKeys.CURRENT_CHAIN_ID, ChainInfoID.Neutron1)

  const rpcEndpoint =
    localStorage.getItem(`${chainId}/${LocalStorageKeys.RPC_ENDPOINT}`) ??
    chains[chainId].endpoints.rpc
  const restEndpoint =
    localStorage.getItem(`${chainId}/${LocalStorageKeys.REST_ENDPOINT}`) ??
    chains[chainId].endpoints.rest

  return {
    ...chains[chainId],
    endpoints: {
      ...chains[chainId].endpoints,
      rpc: rpcEndpoint,
      rest: restEndpoint,
    },
  }
}
