import getOverviewData from 'api/tokenomics/getOverviewData'
import useChainConfig from 'hooks/chain/useChainConfig'
import useSWR from 'swr'
import { getSimplifiedChainId } from 'utils/chainIdAdapter'

export default function useOverviewData(selectedTimeframe = '1M', chartId = 'tab') {
  const daysMapping: { [key: string]: number } = {
    '1D': 1,
    '7D': 7,
    '1M': 30,
    '1Y': 365,
  }
  const days = daysMapping[selectedTimeframe] || 30

  const chainConfig = useChainConfig()
  const simplifiedChainId = getSimplifiedChainId(chainConfig.id)

  return useSWR(
    ['tokenomics/overviewData', days, chartId, simplifiedChainId],
    async () => {
      const responseData = await getOverviewData(days, simplifiedChainId)

      if (!responseData) {
        throw new Error('No data returned from API')
      }

      const TVL = responseData?.data[0].total_value_locked || []
      const totalSupply = responseData?.data[0].total_supply || []
      const totalBorrow = responseData?.data[0].total_borrow || []

      const formattedTVL = TVL.map((entry: { timestamp: string; amount: string }) => ({
        date: new Date(entry.timestamp).toISOString().split('T')[0],
        value: Number(entry.amount),
        label: 'Value Locked',
      }))

      const formattedSupplyBorrow = totalSupply.map(
        (entry: { timestamp: string; amount: string }, index: number) => ({
          date: new Date(entry.timestamp).toISOString().split('T')[0],
          supply: Number(entry.amount),
          borrow: Number(totalBorrow[index]?.amount || 0),
        }),
      )

      return {
        ...responseData,
        formattedTVL,
        formattedSupplyBorrow,
      }
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )
}
