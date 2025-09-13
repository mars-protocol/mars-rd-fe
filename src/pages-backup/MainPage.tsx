import OverviewCharts from 'components/main/overview/OverviewCharts'
import StatsMetrics from 'components/main/overview/StatsMetrics'

export default function MainPage() {
  return (
    <div className='flex flex-wrap gap-6 w-full'>
      <StatsMetrics />
      <OverviewCharts />
    </div>
  )
}
