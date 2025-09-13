import getTokenomicsData from 'api/tokenomics/getTokenomicsData'
import useChainConfig from 'hooks/chain/useChainConfig'
import useSWR from 'swr'

export default function useTokenomicsData(days: string = '30') {
  const chainConfig = useChainConfig()

  return useSWR(
    `chains/${chainConfig.id}/tokenomics/data/${days}`,
    async () => getTokenomicsData(days),
    {
      refreshInterval: 300_000, // 5 minutes
    },
  )
}
