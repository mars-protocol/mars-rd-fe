import MetricsCard from 'components/common/Card/MetricsCard'
import useAssetParams from 'hooks/params/useAssetParams'
import useTotalAccounts from 'hooks/accounts/useTotalAccounts'
import useTvl from 'hooks/tokenomics/useTvl'
import { BN } from 'utils/helpers'
import { BN_ZERO } from 'constants/math'
import { GridGlobe } from 'components/common/Icons'

export default function StatsMetrics() {
  const { data: assetParams, isLoading: assetLoading } = useAssetParams()
  const { data: totalAccounts, isLoading: accountsLoading } = useTotalAccounts()
  const { data: tvl, isLoading: tvlLoading } = useTvl()

  const listedAssetsCount = assetParams
    ? assetParams.filter((asset) => !asset.denom.includes('/UUSDC')).length
    : 0

  const loading = assetLoading || accountsLoading || tvlLoading

  return (
    <MetricsCard
      hideBackground={false}
      background={
        <div className='absolute right-0 top-0 md:w-180 transform scale-y-[-1]'>
          <GridGlobe />
        </div>
      }
      title='MARS PROTOCOL'
      copy='Explore the Mars Protocol Stats Dashboard to track key performance metrics.'
      isLoading={loading}
      metrics={[
        {
          value: tvl ?? BN_ZERO,
          label: 'Total Value Locked',
          isCurrency: true,
          formatOptions: {
            maxDecimals: 2,
            minDecimals: 0,
            abbreviated: true,
          },
          tooltipContent: 'Total value of assets locked in Mars Protocol Red Bank',
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
      className='w-full gap-5 sm:gap-10 md:gap-18'
      numberClassName='text-2xl md:text-4xl'
    />
  )
}
