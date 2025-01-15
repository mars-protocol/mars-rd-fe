import Card from 'components/common/Card'
import ChartError from 'components/common/Chart/common/ChartError'
import ComposedChart from 'components/common/Chart/ComposedChart'
import Divider from 'components/common/Divider'
import DynamicLineChart from 'components/common/Chart/DynamicLineChart'
import Text from 'components/common/Text'
import TimeframeSelector from 'components/common/Chart/common/SelectionControlPanel/TimeframeSelector'
import useOverviewData from 'hooks/tokenomics/useOverviewData'
import { CircularProgress } from 'components/common/CircularProgress'
import { OVERVIEW_CHART_CONFIGS } from 'constants/chartData'
import { TIMEFRAME } from 'constants/timeframe'
import { useOverviewChartData } from 'hooks/tokenomics/useOverviewChartData'
import { useState } from 'react'

export default function OverviewCharts() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>(TIMEFRAME[1].value)

  const {
    data: overviewData,
    isLoading: isOverviewDataLoading,
    error,
    mutate,
  } = useOverviewData(selectedTimeframe)
  const { tvlData, supplyBorrowData } = useOverviewChartData(overviewData)

  const handleRefetch = async () => {
    await mutate()
  }

  const renderContent = () => {
    if (isOverviewDataLoading) {
      return (
        <div className='h-100 w-full flex items-center justify-center'>
          <div className='flex flex-wrap items-center justify-center'>
            <CircularProgress size={60} />
            <Text size='xl' className='w-full text-center'>
              Fetching data...
            </Text>
          </div>
        </div>
      )
    }

    if (error) {
      return <ChartError handleRefetch={handleRefetch} />
    }

    if (!overviewData) {
      return (
        <div className='flex items-center justify-center h-64'>
          <Text className='text-white/60'>No data available</Text>
        </div>
      )
    }

    return (
      <>
        <DynamicLineChart
          data={tvlData}
          lines={OVERVIEW_CHART_CONFIGS.tvl}
          height='h-100'
          title='Total Value Locked'
        />

        <ComposedChart
          data={supplyBorrowData}
          title='Supply/Borrow'
          config={OVERVIEW_CHART_CONFIGS.supplyBorrow}
          height='h-100'
        />
      </>
    )
  }

  return (
    <Card className='w-full p-6 bg-white/5'>
      <div className='flex flex-col gap-6'>
        <div className='flex justify-between items-center'>
          <Text>Overview Data</Text>
          <TimeframeSelector
            timeframe={TIMEFRAME}
            selectedTimeframe={selectedTimeframe}
            setSelectedTimeframe={setSelectedTimeframe}
            className='!my-0'
          />
        </div>
        <Divider />
        {renderContent()}
      </div>
    </Card>
  )
}
