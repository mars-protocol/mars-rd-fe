import getPerpsVaultStats from 'api/perps/getPerpsVaultStats'
import useSWR from 'swr'

export default function usePerpsVaultStats(timeframe: string) {
  return useSWR(
    ['perps/vault-stats', timeframe],
    async () => {
      const response = await getPerpsVaultStats(timeframe)
      return response
    },
    {
      refreshInterval: 60_000,
    },
  )
}
