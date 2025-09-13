'use client'

import OverviewCharts from '../../components/main/overview/OverviewCharts'
import StatsMetrics from '../../components/main/overview/StatsMetrics'
import ClientWrapper from './ClientWrapper'

export default function MainPageContent() {
  return (
    <ClientWrapper>
      <div className='flex flex-wrap gap-6 w-full'>
        <StatsMetrics />
        <OverviewCharts />
      </div>
    </ClientWrapper>
  )
}
