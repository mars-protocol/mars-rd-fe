import { CardWithTabs } from 'components/common/Card/CardWithTabs'
import Chart from 'components/common/Chart'
import ChartError from 'components/common/Chart/ChartError'
import { dummyChartData2 } from 'components/common/Chart/dummydata'
import TimeframeSelector from 'components/common/Chart/SelectionControlPanel/TimeframeSelector'
import useOverviewData from 'hooks/tokenomics/useOverviewData'
import { useState } from 'react'

const timeframe = ['1D', '7D', '1M', '1Y']

export default function TabChart() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>(timeframe[2])

  const {
    data: overviewData,
    isLoading: isOverviewDataLoading,
    isValidating,
    error,
    mutate,
  } = useOverviewData(selectedTimeframe)

  const TVLChartData = overviewData?.formattedTVL

  const handleRefetch = async () => {
    console.log('mutating for tvl')
    await mutate(['tokenomics/overviewData', selectedTimeframe])
  }

  console.log(error, '========ERROR from tvl=======')

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
          {error ? (
            <ChartError handleRefetch={handleRefetch} isValidating={isValidating} />
          ) : (
            <Chart
              data={TVLChartData}
              loading={isValidating || isOverviewDataLoading}
              className='rounded-t-none before:content-none'
            />
          )}
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
  return <CardWithTabs tabs={tabs} contentClassName='bg-white/5' className='mt-10' />
}
