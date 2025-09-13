import MetricsCard from 'components/common/Card/MetricsCard'
import { GridGlobe } from 'components/common/Icons'
import { BN_ZERO } from 'constants/math'
import { PRICE_ORACLE_DECIMALS } from 'constants/query'
import { neutronPerps } from 'data/assets/neutron-perps'
import useTotalAccounts from 'hooks/accounts/useTotalAccounts'
import useAssets from 'hooks/assets/useAssets'
import useChainConfig from 'hooks/chain/useChainConfig'
import useAssetParams from 'hooks/params/useAssetParams'
import useActivePerpsMarketsCount from 'hooks/perps/useActivePerpsMarketsCount'
import useOverviewData from 'hooks/tokenomics/useOverviewData'
import { useMemo } from 'react'
import { ChainInfoID } from 'types/enums'
import { getCurrentChainId } from 'utils/getCurrentChainId'
import { BN } from 'utils/helpers'

export default function StatsMetrics() {
  const { data: totalAccounts, isLoading: totalAccountsLoading } = useTotalAccounts()
  const { data: overviewData, isLoading: overviewDataLoading } = useOverviewData('30')
  const { data: assets, isLoading: assetsLoading } = useAssets()

  const chainId = getCurrentChainId()
  const isNeutron = chainId === ChainInfoID.Neutron1
  const { data: activePerpsCount } = useActivePerpsMarketsCount()
  const chainConfig = useChainConfig()
  const { data: assetParams, isLoading: assetParamsLoading } = useAssetParams()

  const latestTvl = useMemo(() => {
    return overviewData?.total_value_locked?.length
      ? overviewData.total_value_locked[0]?.value || 0
      : 0
  }, [overviewData])

  const listedAssetsCount = useMemo(() => {
    if (assetParamsLoading || !assetParams) return 0
    return assetParams.filter(
      (p) =>
        p.credit_manager?.whitelisted &&
        p.red_bank?.deposit_enabled &&
        !chainConfig.deprecated.includes(p.denom) &&
        !p.denom.includes('share') &&
        !p.denom.includes('gamm'),
    ).length
  }, [assetParams, assetParamsLoading, chainConfig.deprecated])

  const activeStrategies = useMemo(() => {
    if (assetParamsLoading || !assetParams) return []
    return assetParams.filter(
      (p) =>
        p.credit_manager?.whitelisted && (p.denom.includes('share') || p.denom.includes('gamm')),
    )
  }, [assetParams, assetParamsLoading])

  const loading = totalAccountsLoading || overviewDataLoading || assetsLoading || assetParamsLoading

  return (
    <MetricsCard
      hideBackground={false}
      background={
        <div className='absolute right-0 top-0 w-90 sm:w-160 md:w-180 transform scale-y-[-1]'>
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
          value: BN(totalAccounts || 0),
          label: 'Total Amount of Credit Accounts ',
          formatOptions: {
            maxDecimals: 0,
            minDecimals: 0,
          },
        },
        {
          value: BN(listedAssetsCount || 0),
          label: 'Listed Assets',
          formatOptions: {
            maxDecimals: 0,
            minDecimals: 0,
          },
        },
        {
          value: BN(activeStrategies?.length || 0),
          label: 'Active Strategies',
          formatOptions: {
            maxDecimals: 0,
            minDecimals: 0,
          },
          tooltipContent:
            'This includes Liquidity Pool (LP) farming and High Leverage farming strategies',
        },
        ...(isNeutron
          ? [
              {
                value: BN((activePerpsCount ?? 0) || neutronPerps.length || 0),
                label: 'Active Perps Markets',
                formatOptions: {
                  maxDecimals: 0,
                  minDecimals: 0,
                },
              },
            ]
          : []),
      ]}
      className='gap-5 w-full sm:gap-10 md:gap-18'
      numberClassName='text-2xl md:text-4xl'
    />
  )
}
