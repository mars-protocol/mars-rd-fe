import LiquidationsMetrics from 'components/main/LiquidationsMetrics'
import LiquidationsTable from 'components/main/LiquidationsTable'

export default function LiquidationsPage() {
  return (
    <div className='w-full'>
      <LiquidationsMetrics />
      <LiquidationsTable />
    </div>
  )
}