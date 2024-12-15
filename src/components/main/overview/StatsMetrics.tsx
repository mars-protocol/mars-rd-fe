import MetricsCard from 'components/common/Card/MetricsCard'
import useAssetParams from 'hooks/params/useAssetParams'
import useTotalAccounts from 'hooks/accounts/useTotalAccounts'
import useOverviewData from 'hooks/tokenomics/useOverviewData'
import { BN } from 'utils/helpers'
import { BN_ZERO } from 'constants/math'
import { GridGlobe } from 'components/common/Icons'
import { PRICE_ORACLE_DECIMALS } from 'constants/query'

export default function StatsMetrics() {
  const { data: assetParams, isLoading: assetLoading } = useAssetParams()
  const { data: totalAccounts, isLoading: accountsLoading } = useTotalAccounts()
  const { data: overviewData, isLoading: tvlLoading } = useOverviewData('30')
  const latestTvl = overviewData?.total_value_locked?.length
    ? overviewData.total_value_locked[0]?.value || 0
    : 0
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
          value: latestTvl ? BN(latestTvl).shiftedBy(-PRICE_ORACLE_DECIMALS) : BN_ZERO,
          label: 'Total Value Locked',
          isCurrency: true,
          formatOptions: {
            maxDecimals: 2,
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
      className='w-full gap-5 sm:gap-10 md:gap-18'
      numberClassName='text-2xl md:text-4xl'
    />
  )
}
