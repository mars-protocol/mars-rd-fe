'use client'

import MarsTokenCard from '../../../components/main/tokenomics/MarsTokenCard'
import TokenomicsCharts from '../../../components/main/tokenomics/TokenomicsCharts'
import TokenomicsMetrics from '../../../components/main/tokenomics/TokenomicsMetrics'
import ClientWrapper from '../../components/ClientWrapper'

export default function TokenomicsPageContent() {
  return (
    <ClientWrapper>
      <div className='space-y-4 w-full'>
        <TokenomicsMetrics />
        <MarsTokenCard />
        <TokenomicsCharts />
      </div>
    </ClientWrapper>
  )
}
