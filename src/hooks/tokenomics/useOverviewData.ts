import getOverviewData from 'api/tokenomics/getOverviewData'
import useSWR from 'swr'

export default function useOverviewData() {
  return useSWR(
    'tokenomics/overviewData',
    async () => {
      const responseData = await getOverviewData()

      const TVL = responseData?.data[0].total_value_locked || null

      const formattedTVL = TVL.map((entry) => ({
        date: new Date(entry.timestamp).toISOString().split('T')[0],
        value: Number(entry.amount),
      }))

      return {
        ...responseData,
        formattedTVL,
      }
    },
    {
      refreshInterval: 60_000,
    },
  )
}
