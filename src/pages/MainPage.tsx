import StatsMetrics from 'components/main/overview/StatsMetrics'
import TokenMetrics from 'components/main/overview/TokenMetrics'
import DropdownChart from 'components/main/overview/Chart/DropdownChart'
import TabChart from 'components/main/overview/Chart/TabChart'

export default function MainPage() {
  return (
    <div className='flex w-full flex-wrap'>
      <StatsMetrics />
      <TokenMetrics />
      <TabChart />
      <DropdownChart className='mt-10 w-full' />
    </div>
  )
}
