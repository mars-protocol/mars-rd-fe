'use client'

import TokenomicsCharts from 'components/main/tokenomics/TokenomicsCharts'
import TokenomicsMetrics from 'components/main/tokenomics/TokenomicsMetrics'
import TokenomicsOverview from 'components/main/tokenomics/TokenomicsOverview'
import ClientWrapper from 'app/components/ClientWrapper'

export default function TokenomicsPageContent() {
  return (
    <ClientWrapper>
      <div className='space-y-4 w-full'>
        <TokenomicsMetrics />
        <TokenomicsOverview />
        <TokenomicsCharts />
      </div>
    </ClientWrapper>
  )
}
