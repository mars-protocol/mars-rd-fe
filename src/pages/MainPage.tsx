import Chart from 'components/common/Chart'
import ChartCard from 'components/common/Chart/ChartCard'
import StatsMetrics from 'components/main/StatsMetrics'
import TokenMetrics from 'components/main/TokenMetrics'
import useOverviewData from 'hooks/tokenomics/useOverviewData'
import { CardWithTabs } from 'components/common/Card/CardWithTabs'
import { dummyChartData2 } from 'components/common/Chart/dummydata'

export default function MainPage() {
  const { data: overviewData, isLoading: isOverviewDataLoading } = useOverviewData()

  const TVLChartData = overviewData?.formattedTVL

  const tabs: CardTab[] = [
    {
      title: 'TVL',
      renderContent: () => (
        <Chart
          data={TVLChartData}
          loading={isOverviewDataLoading}
          className='rounded-t-none before:content-none'
        />
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
