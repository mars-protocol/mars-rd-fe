import getLiquidations from 'api/liquidations/getLiquidations'
import useSWR from 'swr'

export default function useLiquidations(page = 1, pageSize = 25) {
  return useSWR(
    ['liquidations/liquidationsData', page, pageSize],
    async () => {
      return getLiquidations(page, pageSize)
    },
    {
      refreshInterval: 120_000,
    },
  )
}
