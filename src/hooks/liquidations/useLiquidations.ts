import getLiquidations from 'api/liquidations/getLiquidations'
import useSWR from 'swr'

export default function useLiquidations() {
  return useSWR('liquidations/liquidationsData', async () => getLiquidations(), {
    refreshInterval: 10_000,
  })
}
