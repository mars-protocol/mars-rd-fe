import StatsMetrics from 'components/main/overview/StatsMetrics'
import TokenMetrics from 'components/main/overview/TokenMetrics'
import OverviewCharts from 'components/main/overview/OverviewCharts'

export default function MainPage() {
  return (
    <div className='flex w-full flex-wrap gap-6'>
      <StatsMetrics />
      <TokenMetrics />
      <OverviewCharts />
    </div>
  )
}
