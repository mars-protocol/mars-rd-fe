import getPerpsMarketStats from 'api/perps/getPerpsMarketStats'
import useSWR from 'swr'

export default function usePerpsMarketStats() {
  return useSWR(['perps/perpsMarketStats'], async () => getPerpsMarketStats(), {
    refreshInterval: 60_000,
  })
}
