import Card from 'components/common/Card'
import ChartError from 'components/common/Chart/common/ChartError'
import TimeframeSelector from 'components/common/Chart/common/SelectionControlPanel/TimeframeSelector'
import ComposedChart from 'components/common/Chart/ComposedChart'
import DynamicLineChart from 'components/common/Chart/DynamicLineChart'
import Divider from 'components/common/Divider'
import Text from 'components/common/Text'
import { OVERVIEW_CHART_CONFIGS } from 'constants/chartData'
import { TIMEFRAME } from 'constants/timeframe'
import { useOverviewChartData } from 'hooks/tokenomics/useOverviewChartData'
import useOverviewData from 'hooks/tokenomics/useOverviewData'
import { useState } from 'react'

export default function OverviewCharts() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>(TIMEFRAME[0].value)

  const {
    data: overviewData,
    isLoading: isOverviewDataLoading,
    isValidating,
    error,
    mutate,
  } = useOverviewData(selectedTimeframe)
  const { tvlData, supplyBorrowData } = useOverviewChartData(overviewData)

  const handleRefetch = async () => {
    await mutate()
  }
  const isDataEmpty =
    (!isOverviewDataLoading && overviewData === null) ||
    (tvlData?.length === 0 && supplyBorrowData?.length === 0)

  return (
    <Card className='w-full p-6 bg-white/5'>
      <div className='flex flex-col gap-6'>
        <div className='flex justify-between items-center'>
          <Text>Overview Data</Text>
          <TimeframeSelector
            timeframe={TIMEFRAME}
            selectedTimeframe={selectedTimeframe}
            setSelectedTimeframe={setSelectedTimeframe}
          />
        </div>
        <Divider />
        {error ? (
          <ChartError handleRefetch={handleRefetch} />
        ) : isDataEmpty ? (
          <div className='flex items-center justify-center h-64'>
            <Text className='text-white/60'>No data available</Text>
          </div>
        ) : (
          <>
            <DynamicLineChart
              data={tvlData}
              lines={OVERVIEW_CHART_CONFIGS.tvl}
              height='h-100'
              title='Total Value Locked'
              loading={isValidating || isOverviewDataLoading}
            />

            <ComposedChart
              data={supplyBorrowData}
              title='Supply/Borrow'
              loading={isValidating || isOverviewDataLoading}
              config={OVERVIEW_CHART_CONFIGS.supplyBorrow}
              height='h-100'
            />
          </>
        )}
      </div>
    </Card>
  )
}
