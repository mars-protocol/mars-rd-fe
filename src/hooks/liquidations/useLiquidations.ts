import getLiquidations from 'api/liquidations/getLiquidations'
import useSWR from 'swr'
import useChainConfig from 'hooks/chain/useChainConfig'

export default function useLiquidations(page = 1, pageSize = 25) {
  const chainConfig = useChainConfig()

  return useSWR(
    chainConfig && ['liquidations/liquidationsData', chainConfig.id, page, pageSize],
    async () => {
      return getLiquidations(page, pageSize)
    },
    {
      refreshInterval: 120_000,
      suspense: true,
    },
  )
}
