import getOverviewData from 'api/tokenomics/getOverviewData'
import useChainConfig from 'hooks/chain/useChainConfig'
import useSWR from 'swr'

export default function useOverviewData(timeframe: string) {
  const chainConfig = useChainConfig()
  return useSWR(
    chainConfig && [`${chainConfig.id}/tokenomics/overviewData`, timeframe],
    async () => getOverviewData(chainConfig.id, timeframe),
    {
      refreshInterval: 60_000,
    },
  )
}
