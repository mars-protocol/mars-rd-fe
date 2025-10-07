import getPerpsGlobalStats from 'api/perps/getPerpsGlobalStats'
import getPerpsMarketStats from 'api/perps/getPerpsMarketStats'
import useSWR from 'swr'

export default function usePerpsStats(selectedMarket: string, timeframe: string) {
  const isGlobalStats = selectedMarket === 'total'
  return useSWR(
    ['perps/stats', selectedMarket, timeframe],
    async () => {
      if (isGlobalStats) {
        return getPerpsGlobalStats(timeframe)
      } else {
        return getPerpsMarketStats(selectedMarket, timeframe)
      }
    },
    {
      refreshInterval: 60_000,
    },
  )
}
