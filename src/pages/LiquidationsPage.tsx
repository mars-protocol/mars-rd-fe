import LiquidationsMetrics from 'components/main/Liquidations/LiquidationsMetrics'
import LiquidationsTable from 'components/main/Liquidations/Table/LiquidationsTable'

export default function LiquidationsPage() {
  return (
    <div className='w-full'>
      <LiquidationsMetrics />
      <LiquidationsTable />
    </div>
  )
}
