import getPerpsGlobalStats from 'api/perps/getPerpsGlobalStats'
import getPerpsMarketStats from 'api/perps/getPerpsMarketStats'
import useSWR from 'swr'

export default function usePerpsStats(selectedOption: string, timeframe: string) {
  const isGlobalStats = selectedOption === 'total'
  return useSWR(
    ['perps/stats', selectedOption, timeframe],
    async () => {
      if (isGlobalStats) {
        return getPerpsGlobalStats(timeframe)
      } else {
        return getPerpsMarketStats(selectedOption, timeframe)
      }
    },
    {
      refreshInterval: 60_000,
    },
  )
}
