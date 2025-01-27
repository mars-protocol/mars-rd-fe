import MetricsCard from 'components/common/Card/MetricsCard'
import { GridLandscape } from 'components/common/Icons'
import { BN_ZERO } from 'constants/math'
import { PRICE_ORACLE_DECIMALS } from 'constants/query'
import usePerpsStats from 'hooks/perps/usePerpsGlobalStats'
import { BN } from 'utils/helpers'

export default function PerpsMetrics() {
  const { data: perpsStats, isLoading: perpsStatsLoading } = usePerpsStats('total', '90')

  const totalTradingVolume = perpsStats?.daily_trading_volume.reduce(
    (acc, day) => acc.plus(BN(day.value || 0)),
    BN_ZERO,
  )

  const perpsMetrics: Metric[] = [
    {
      value: totalTradingVolume?.shiftedBy(-PRICE_ORACLE_DECIMALS) || BN(0),
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
      value: BN(perpsStats?.fees.trading_fee[0]?.value || 0).shiftedBy(-PRICE_ORACLE_DECIMALS),
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
        <div className='absolute bottom-0 right-0 md:w-190'>
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
