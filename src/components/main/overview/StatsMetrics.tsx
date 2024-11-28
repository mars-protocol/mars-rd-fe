import MetricsCard from 'components/common/Card/MetricsCard'
import { GridGlobe } from 'components/common/Icons'
import useTotalAccounts from 'hooks/accounts/useTotalAccounts'
import useAssetParams from 'hooks/params/useAssetParams'
import { BN } from 'utils/helpers'

export default function StatsMetrics() {
  const { data: assetParams } = useAssetParams()
  const { data: totalAccounts } = useTotalAccounts()

  console.log('accounts STATS ======', totalAccounts)
  const listedAssetsCount = assetParams
    ? assetParams.filter((asset) => !asset.denom.includes('/UUSDC')).length
    : 0

  return (
    <MetricsCard
      hideBackground={false}
      background={
        <div className='absolute right-0 top-0 md:w-[500px] transform scale-y-[-1]'>
          <GridGlobe />
        </div>
      }
      title='MARS PROTOCOL'
      copy='Explore the Mars Protocol Stats Dashboard to track key performance metrics.'
      metrics={[
        {
          value: BN(0),
          label: 'TVL',
          isCurrency: true,
          formatOptions: {
            maxDecimals: 0,
            minDecimals: 0,
            abbreviated: true,
          },
        },
        {
          value: BN(totalAccounts),
          label: 'Total Amount of Credit Accounts ',
          formatOptions: {
            maxDecimals: 0,
            minDecimals: 0,
          },
        },
        {
          value: BN(listedAssetsCount),
          label: 'Listed Assets',
          formatOptions: {
            maxDecimals: 0,
            minDecimals: 0,
          },
        },
      ]}
      className='w-full gap-5 mx-auto sm:gap-10 md:gap-18 sm:p-10'
      numberClassName='text-2xl md:text-5xl'
    />
  )
}
