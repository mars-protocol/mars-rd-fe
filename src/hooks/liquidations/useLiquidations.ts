import getLiquidations from 'api/liquidations/getLiquidations'
import useSWR from 'swr'

export default function useLiquidations(page = 1, pageSize = 20) {
  return useSWR(
    ['liquidations/liquidationsData', page, pageSize],
    async () => getLiquidations(page, pageSize),
    {
      refreshInterval: 60_000,
    },
  )
}
