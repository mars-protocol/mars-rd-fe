import getOverviewData from 'api/tokenomics/getOverviewData'
import useSWR from 'swr'

export default function useOverviewData() {
  return useSWR('tokenomics/overviewData', async () => getOverviewData(), {
    refreshInterval: 10_000,
  })
}
