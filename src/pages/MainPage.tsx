import Chart from 'components/common/Chart'
import ChartCard from 'components/common/Chart/ChartCard'
import StatsMetrics from 'components/main/StatsMetrics'
import TokenMetrics from 'components/main/TokenMetrics'
import useOverviewData from 'hooks/tokenomics/useOverviewData'
import { CardWithTabs } from 'components/common/Card/CardWithTabs'
import { dummyChartData2 } from 'components/common/Chart/dummydata'
import TimeframeSelector from 'components/common/Chart/SelectionControlPanel/TimeframeSelector'
import { useState } from 'react'

const timeframe = ['1D', '7D', '1M', '1Y']

export default function MainPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>(timeframe[2])

  const { data: overviewData, isLoading: isOverviewDataLoading } =
    useOverviewData(selectedTimeframe)

  const TVLChartData = overviewData?.formattedTVL

  const tabs: CardTab[] = [
    {
      title: 'TVL',
      renderContent: () => (
        <div className='relative'>
          <TimeframeSelector
            timeframe={timeframe}
            selectedTimeframe={selectedTimeframe}
            setSelectedTimeframe={setSelectedTimeframe}
            className='absolute right-5 top-0'
          />
          <Chart
            data={TVLChartData}
            loading={isOverviewDataLoading}
            className='rounded-t-none before:content-none'
          />
        </div>
      ),
    },
    // TODO: replace with real data
    {
      title: 'Trading Volume',
      renderContent: () => (
        <Chart data={dummyChartData2} className='rounded-t-none before:content-none' />
      ),
    },
  ]

  return (
    <div className='flex w-full flex-wrap'>
      <StatsMetrics />
      <TokenMetrics />
      <CardWithTabs tabs={tabs} contentClassName='bg-white/5' className='mt-10' />
      <ChartCard className='mt-10 w-full' />
    </div>
  )
}
