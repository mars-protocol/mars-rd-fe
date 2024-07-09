import Card from 'components/common/Card'
import Loading from 'components/common/Loading'
import StatsTrading from 'components/common/Stats/StatsTrading'
import Assets from 'components/main/Assets'
import useTotalSupply from 'hooks/tokenomics/useTotalSupply'
import { Suspense } from 'react'

export default function MainPage() {
  const { data: totalSupply } = useTotalSupply()
  return (
    <div className='flex items-start justify-start w-full gap-4'>
      <div className='flex w-1/2 gap-4'>
        <StatsTrading />
        {/* testingggg */}
        {/* testingggg */}
        {/* testingggg */}
      </div>

      <Card
        title='Assets'
        contentClassName='px-4 py-2 flex-wrap flex items-center gap-8'
        className='flex w-1/2'
      >
        <Suspense fallback={<Loading className='w-full h-8' />}>
          <Assets />
        </Suspense>
      </Card>
    </div>
  )
}
