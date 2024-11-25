import LiquidationsMetrics from 'components/main/liquidations/LiquidationsMetrics'
import LiquidationsTable from 'components/main/liquidations/table/LiquidationsTable'

export default function LiquidationsPage() {
  return (
    <div className='w-full'>
      <LiquidationsMetrics />
      <LiquidationsTable />
    </div>
  )
}
