'use client'

import ClientWrapper from 'app/components/ClientWrapper'
import OverviewCharts from 'components/main/overview/OverviewCharts'
import StatsMetrics from 'components/main/overview/StatsMetrics'

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
