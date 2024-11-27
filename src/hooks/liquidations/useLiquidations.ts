import getLiquidations from 'api/liquidations/getLiquidations'
import useChainConfig from 'hooks/chain/useChainConfig'
import useSWR from 'swr'
import { getSimplifiedChainId } from 'utils/chainIdAdapter'

export default function useLiquidations(page = 1, pageSize = 25) {
  const chainConfig = useChainConfig()
  const simplifiedChainId = getSimplifiedChainId(chainConfig.id)

  return useSWR(
    ['liquidations/liquidationsData', simplifiedChainId, page, pageSize],
    async () => {
      return getLiquidations(simplifiedChainId, page, pageSize)
    },
    {
      refreshInterval: 120_000,
    },
  )
}
