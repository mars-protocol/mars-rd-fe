'use client'

import chains from 'chains'
import { LocalStorageKeys } from 'constants/localStorageKeys'
import { useSearchParams } from 'next/navigation'
import { ChainInfoID } from 'types/enums'

export default function useChainConfig() {
  const searchParams = useSearchParams()
  const urlChain = searchParams?.get('chain')
  const chainId = urlChain === 'osmosis' ? ChainInfoID.Osmosis1 : ChainInfoID.Neutron1

  const rpcEndpoint =
    typeof window !== 'undefined'
      ? (localStorage.getItem(`${chainId}/${LocalStorageKeys.RPC_ENDPOINT}`) ??
        chains[chainId].endpoints.rpc)
      : chains[chainId].endpoints.rpc

  const restEndpoint =
    typeof window !== 'undefined'
      ? (localStorage.getItem(`${chainId}/${LocalStorageKeys.REST_ENDPOINT}`) ??
        chains[chainId].endpoints.rest)
      : chains[chainId].endpoints.rest

  return {
    ...chains[chainId],
    endpoints: {
      ...chains[chainId].endpoints,
      rpc: rpcEndpoint,
      rest: restEndpoint,
    },
  }
}
