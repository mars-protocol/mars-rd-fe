import useSWR from 'swr'

import getAccount from 'api/accounts/getAccount'
import useAssets from 'hooks/assets/useAssets'
import useChainConfig from 'hooks/chain/useChainConfig'

export default function useAccount(accountId?: string, suspense?: boolean) {
  const { data: assets } = useAssets()
  const chainConfig = useChainConfig()

  return useSWR(
    !!accountId && `chains/${chainConfig.id}/accounts/${accountId}`,
    () => getAccount(chainConfig, assets, accountId),
    {
      suspense: suspense,
      revalidateOnFocus: false,
    },
  )
}
