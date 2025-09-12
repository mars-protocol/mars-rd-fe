import MarsTokenCard from 'components/main/tokenomics/MarsTokenCard'
import TokenomicsCharts from 'components/main/tokenomics/TokenomicsCharts'
import TokenomicsMetrics from 'components/main/tokenomics/TokenomicsMetrics'

export default function TokenomicsPage() {
  return (
    <div className='space-y-4 w-full'>
      <TokenomicsMetrics />
      <MarsTokenCard />
      <TokenomicsCharts />
    </div>
  )
}
