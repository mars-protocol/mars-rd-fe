import getOverviewData from 'api/tokenomics/getOverviewData'
import useChainConfig from 'hooks/chain/useChainConfig'
import useSWR from 'swr'
import { getSimplifiedChainId } from 'utils/chainIdAdapter'

export default function useOverviewData(timeframe: string) {
  const chainConfig = useChainConfig()
  const simplifiedChainId = getSimplifiedChainId(chainConfig.id)

  return useSWR(
    ['tokenomics/overviewData', timeframe, simplifiedChainId],
    async () => getOverviewData(timeframe, simplifiedChainId),
    {
      refreshInterval: 60_000,
    },
  )
}
