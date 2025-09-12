import getTokenomicsData from 'api/tokenomics/getTokenomicsData'
import useSWR from 'swr'

export default function useTokenomicsData(days: string = '30') {
  return useSWR(`tokenomics/data/${days}`, async () => getTokenomicsData(days), {
    refreshInterval: 300_000, // 5 minutes
  })
}
