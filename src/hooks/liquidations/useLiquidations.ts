import getLiquidations from 'api/liquidations/getLiquidations'
import useSWR from 'swr'
import useChainConfig from 'hooks/chain/useChainConfig'

export default function useLiquidations(page = 1, pageSize = 25, searchQuery?: string | string[]) {
  const chainConfig = useChainConfig()

  return useSWR(
    chainConfig && ['liquidations/liquidationsData', chainConfig.id, page, pageSize, searchQuery],
    async () => {
      return getLiquidations(chainConfig.id, page, pageSize, searchQuery)
    },
    {
      refreshInterval: 120_000,
    },
  )
}
