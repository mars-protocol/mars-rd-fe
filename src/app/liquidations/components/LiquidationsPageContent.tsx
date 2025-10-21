'use client'

import LiquidationsMetrics from 'components/main/Liquidations/LiquidationsMetrics'
import LiquidationsTable from 'components/main/Liquidations/Table/LiquidationsTable'
import ClientWrapper from 'app/components/ClientWrapper'

export default function LiquidationsPageContent() {
  return (
    <ClientWrapper>
      <div className='w-full'>
        <LiquidationsMetrics />
        <LiquidationsTable />
      </div>
    </ClientWrapper>
  )
}
