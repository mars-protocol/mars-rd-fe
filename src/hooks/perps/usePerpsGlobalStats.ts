import getPerpsGlobalStats from 'api/perps/getPerpsGlobalStats'
import useSWR from 'swr'

export default function usePerpsGlobalStats(timeframe: string) {
  return useSWR(['perps/perpsGlobalStats', timeframe], async () => getPerpsGlobalStats(timeframe), {
    refreshInterval: 60_000,
  })
}
