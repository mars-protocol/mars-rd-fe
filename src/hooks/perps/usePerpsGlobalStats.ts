import getPerpsGlobalStats from 'api/perps/getPerpsGlobalStats'
import getPerpsMarketStats from 'api/perps/getPerpsMarketStats'
import useSWR from 'swr'

export default function usePerpsStats(selectedOption: string, timeframe: string) {
  const isGlobalStats = selectedOption === 'total'
  console.log(selectedOption, 'selectedOption')
  return useSWR(
    ['perps/stats', selectedOption, timeframe],
    async () => {
      if (isGlobalStats) {
        console.log('prvni IF')
        return getPerpsGlobalStats(timeframe)
      } else {
        console.log('druhy IF')
        return getPerpsMarketStats(selectedOption, timeframe)
      }
    },
    {
      refreshInterval: 60_000,
    },
  )
}
