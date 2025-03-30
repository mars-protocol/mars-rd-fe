import getTotalAccounts from 'api/accounts/getTotalAccounts'
import useSWRImmutable from 'swr/immutable'
import useChainConfig from 'hooks/chain/useChainConfig'

export default function useTotalAccounts() {
  const chainConfig = useChainConfig()

  return useSWRImmutable(
    `chains/${chainConfig.id}/totalAccounts`,
    () => getTotalAccounts(chainConfig),
    {
      suspense: false,
    },
  )
}
