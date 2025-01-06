import MetricsCard from 'components/common/Card/MetricsCard'
import usePerpsStats from 'hooks/perps/usePerpsGlobalStats'
import { BN } from 'utils/helpers'
import { GridLandscape } from 'components/common/Icons'
import { PRICE_ORACLE_DECIMALS } from 'constants/query'

export default function PerpsMetrics() {
  const { data: perpsStats, isLoading: perpsStatsLoading } = usePerpsStats('total', '30')

  const perpsMetrics: Metric[] = [
    {
      value: BN(perpsStats?.cumulative_trading_volume || 0).shiftedBy(-PRICE_ORACLE_DECIMALS),
      label: 'Total Trading Volume',
      isCurrency: true,
      formatOptions: {
        maxDecimals: 2,
        minDecimals: 0,
        abbreviated: true,
      },
    },
    {
      value: BN(perpsStats?.funding_and_pnl.realized_pnl[0]?.value || 0).shiftedBy(
        -PRICE_ORACLE_DECIMALS,
      ),
      label: 'Total Realized PnL',
      isCurrency: true,
      formatOptions: {
        maxDecimals: 2,
        minDecimals: 0,
        abbreviated: true,
      },
      showSignPrefix: true,
    },
    {
      value: BN(perpsStats?.funding_and_pnl.unrealized_pnl[0]?.value || 0).shiftedBy(
        -PRICE_ORACLE_DECIMALS,
      ),
      label: 'Total Unrealized PnL',
      isCurrency: true,
      formatOptions: {
        maxDecimals: 2,
        minDecimals: 0,
        abbreviated: true,
      },
      showSignPrefix: true,
    },
    {
      value: BN(perpsStats?.fees?.realized_trading_fee?.[0]?.value || 0).shiftedBy(
        -PRICE_ORACLE_DECIMALS,
      ),
      label: 'Total Trading Fees',
      isCurrency: true,
      formatOptions: {
        maxDecimals: 2,
        minDecimals: 0,
        abbreviated: true,
      },
    },
  ]

  return (
    <MetricsCard
      hideBackground={false}
      background={
        <div className='absolute right-0 bottom-0 w-90 sm:w-160 md:w-190'>
          <GridLandscape />
        </div>
      }
      title='PERPS STATS'
      copy='Explore the Mars Protocol Perpetuals Dashboard to track performance metrics.'
      metrics={perpsMetrics}
      isLoading={perpsStatsLoading}
      className='w-full gap-5 sm:gap-10 md:gap-18'
      numberClassName='text-2xl md:text-4xl'
    />
  )
}
