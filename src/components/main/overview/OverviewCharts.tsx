import Card from 'components/common/Card'
import ChartError from 'components/common/Chart/common/ChartError'
import TimeframeSelector from 'components/common/Chart/common/SelectionControlPanel/TimeframeSelector'
import ComposedChart from 'components/common/Chart/ComposedChart'
import DynamicLineChart from 'components/common/Chart/DynamicLineChart'
import { CircularProgress } from 'components/common/CircularProgress'
import Divider from 'components/common/Divider'
import Text from 'components/common/Text'
import { OVERVIEW_CHART_CONFIGS } from 'constants/chartData'
import { OVERVIEW_TIMEFRAME } from 'constants/timeframe'
import { useOverviewChartData } from 'hooks/tokenomics/useOverviewChartData'
import useOverviewData from 'hooks/tokenomics/useOverviewData'
import { useState } from 'react'

export default function OverviewCharts() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>(OVERVIEW_TIMEFRAME[1].value)

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
        <div className='flex justify-center items-center w-full h-100'>
          <div className='flex flex-wrap justify-center items-center'>
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

    if (!tvlData || !supplyBorrowData) {
      return (
        <div className='flex justify-center items-center h-64'>
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
          customYAxisDomain={(values) => {
            const max = Math.max(...values)
            const min = Math.min(...values)
            const padding = (max - min) * 0.3 // 30% padding
            return [min - padding, max + padding]
          }}
        />

        <ComposedChart
          data={supplyBorrowData}
          title='Supply/Borrow'
          config={OVERVIEW_CHART_CONFIGS.supplyBorrow}
          requiresOracleAdjustment={true}
          height='h-100'
        />
      </>
    )
  }

  return (
    <Card className='p-4 w-full md:p-6 bg-white/5'>
      <div className='flex flex-col gap-6'>
        <div className='flex justify-between items-center'>
          <Text>Overview Data</Text>
          <TimeframeSelector
            timeframe={OVERVIEW_TIMEFRAME}
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
