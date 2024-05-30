import StatsTrading from 'components/Stats/StatsTrading'
import Card from 'components/common/Card'
import Loading from 'components/common/Loading'
import AssetImage from 'components/common/assets/AssetImage'
import useDepositEnabledAssets from 'hooks/assets/useDepositEnabledAssets'
import { Suspense } from 'react'

export default function MainPage() {
  return (
    <div className='flex items-start justify-start w-full gap-4'>
      <div className='flex w-1/2 gap-4'>
        <StatsTrading />
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

function Assets() {
  const assets = useDepositEnabledAssets()

  return (
    <>
      {assets.map((asset) => (
        <div className='flex items-center gap-2' key={asset.denom}>
          <div className='w-6 h-6 overflow-hidden rounded-full'>
            <AssetImage asset={asset} />
          </div>
          {asset.symbol}
        </div>
      ))}
    </>
  )
}
