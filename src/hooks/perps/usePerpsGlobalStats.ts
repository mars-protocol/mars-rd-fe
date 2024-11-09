import getPerpsGlobalStats from 'api/perps/getPerpsGlobalStats'
import useSWR from 'swr'

export default function usePerpsGlobalStats() {
  return useSWR(['perps/perpsGlobalStats'], async () => getPerpsGlobalStats(), {
    refreshInterval: 60_000,
  })
}
