import TimeframeSelector from 'components/common/Chart/common/SelectionControlPanel/TimeframeSelector'
import useOverviewData from 'hooks/tokenomics/useOverviewData'
import { CardWithTabs } from 'components/common/Card/CardWithTabs'
import { TIMEFRAME } from 'constants/timeframe'
import { useState } from 'react'
import ChartError from 'components/common/Chart/common/ChartError'
import AreaChart from 'components/common/Chart/AreaChart'

export default function TabChart() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>(TIMEFRAME[0].value)

  const {
    data: tabOverviewData,
    isLoading: isTabOverviewDataLoading,
    isValidating,
    error,
    mutate,
  } = useOverviewData(selectedTimeframe, 'tab')

  const TVLData: ChartData = tabOverviewData?.formattedTVL

  const handleRefetch = async () => {
    await mutate(['tokenomics/overviewData', selectedTimeframe, 'tab'])
  }

  const tabs: CardTab[] = [
    {
      title: 'TVL',
      renderContent: () => (
        <div className='relative'>
          <TimeframeSelector
            timeframe={TIMEFRAME}
            selectedTimeframe={selectedTimeframe}
            setSelectedTimeframe={setSelectedTimeframe}
            className='absolute right-5 top-0'
          />
          {error ? (
            <ChartError handleRefetch={handleRefetch} />
          ) : (
            <AreaChart
              data={TVLData}
              loading={isValidating || isTabOverviewDataLoading}
              className='rounded-t-none before:content-none'
            />
          )}
        </div>
      ),
    },
  ]
  return <CardWithTabs tabs={tabs} contentClassName='bg-white/5' className='mt-10' />
}
