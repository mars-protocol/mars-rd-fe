import usePerpsGlobalStats from 'hooks/perps/usePerpsGlobalStats'
import StatisticsPanel from 'components/main/perps/perpsMarketStats/StatisticsPanel'
import DynamicLineChart from 'components/common/Chart/DynamicLineChart'
import SynchronizedAreaChart from 'components/common/Chart/SynchronizedAreaChart'
import { useMemo } from 'react'
import { mergeDateValueArrays, transformDateValueArray } from 'utils/helpers'
import ChartError from 'components/common/Chart/common/ChartError'
import { CircularProgress } from 'components/common/CircularProgress'
import Text from 'components/common/Text'
import { mutate } from 'swr'
import BarChart from 'components/common/Chart/BarChart'

export default function PerpsMarketStats() {
  const {
    data: perpsGlobalStats,
    isLoading: perpsGlobalStatsLoading,
    error,
  } = usePerpsGlobalStats()

  console.log(perpsGlobalStats, 'perpsGlobalStatsperpsGlobalStatsperpsGlobalStats')

  const openInterestData = useMemo(() => {
    if (perpsGlobalStats?.open_interest) {
      const longData = transformDateValueArray(perpsGlobalStats.open_interest.long, 'long')
      const shortData = transformDateValueArray(perpsGlobalStats.open_interest.short, 'short')
      const totalData = transformDateValueArray(perpsGlobalStats.open_interest.total, 'total')

      return mergeDateValueArrays(longData, shortData, totalData)
    }
    return []
  }, [perpsGlobalStats])

  const pnlData = useMemo(() => {
    if (perpsGlobalStats?.funding_and_pnl) {
      const unrealizedPnl = transformDateValueArray(
        perpsGlobalStats.funding_and_pnl.unrealized_pnl,
        'Unrealized',
      )
      const realizedPnl = transformDateValueArray(
        perpsGlobalStats.funding_and_pnl.realized_pnl,
        'Realized',
      )
      return mergeDateValueArrays(unrealizedPnl, realizedPnl)
    }
    return []
  }, [perpsGlobalStats])

  const feesData = useMemo(() => {
    if (perpsGlobalStats?.fees.trading_fee) {
      const tradingFees = transformDateValueArray(perpsGlobalStats.fees.trading_fee, 'trading_fees')
      const fundingFees = transformDateValueArray(
        perpsGlobalStats.fees.net_funding_fee,
        'net_funding_fees',
      )
      return mergeDateValueArrays(tradingFees, fundingFees)
    }
    return []
  }, [perpsGlobalStats])

  const imbalanceRatioData = useMemo(() => {
    if (perpsGlobalStats?.fees.trading_fee) {
      const imbalance_long = transformDateValueArray(
        perpsGlobalStats.skew_data.imbalance_long_ratio,
        'imbalance_long',
      )

      return mergeDateValueArrays(imbalance_long)
    }
    return []
  }, [perpsGlobalStats])

  const skewData = useMemo(() => {
    if (perpsGlobalStats?.fees.trading_fee) {
      const skew = transformDateValueArray(perpsGlobalStats.skew_data.skew, 'skew')

      return mergeDateValueArrays(skew)
    }
    return []
  }, [perpsGlobalStats])

  const notionalLiquidatedData = useMemo(() => {
    if (perpsGlobalStats?.notional_liquidated) {
      const notionalLiquidated = transformDateValueArray(
        perpsGlobalStats.notional_liquidated,
        'notional_liquidated',
      )

      return mergeDateValueArrays(notionalLiquidated)
    }
    return []
  }, [perpsGlobalStats])

  const dailyTradingVolumeData = useMemo(() => {
    if (perpsGlobalStats?.daily_trading_volume) {
      const dailyTradingVolume = transformDateValueArray(
        perpsGlobalStats.daily_trading_volume,
        'daily_trading_volume',
      )

      return mergeDateValueArrays(dailyTradingVolume)
    }
    return []
  }, [perpsGlobalStats])

  const vaultData = useMemo(() => {
    if (perpsGlobalStats?.vault_data) {
      const deposit = transformDateValueArray(perpsGlobalStats.vault_data.deposit, 'deposit')
      // const value = transformDateValueArray(perpsGlobalStats.vault_data.vault_value, 'vault_value')
      const collateralizationRatio = transformDateValueArray(
        perpsGlobalStats.vault_data.vault_collateralization_ratio,
        'vault_collateralization_ratio',
      )

      return mergeDateValueArrays(deposit, collateralizationRatio)
    }
    return []
  }, [perpsGlobalStats])

  const lineConfigsVault = [
    { dataKey: 'deposit', color: '#AB47BC', name: 'Deposit' },
    // { dataKey: 'vault_value', color: '#580DA3', name: 'Value' },
    { dataKey: 'vault_collateralization_ratio', color: '#580DA3', name: 'Collateralization Ratio' },
  ]
  const lineConfigsTradingFees = [
    { dataKey: 'trading_fees', color: '#AB47BC', name: 'Trading Fees' },
    { dataKey: 'net_funding_fees', color: '#580DA3', name: 'Net Funding Fees' },
  ]

  const lineConfigsSkew = [{ dataKey: 'skew', color: '#580DA3', name: 'Skew' }]
  const lineConfigsNotional = [
    { dataKey: 'notional_liquidated', color: '#AB47BC', name: 'Notional Liquidated' },
  ]
  const lineConfigsTradingVolume = [
    { dataKey: 'daily_trading_volume', color: '#30E0A1', name: 'Daily Trading Volume' },
  ]
  const lineConfigsImbalanceRatio = [
    {
      dataKey: 'imbalance_long',
      color: '#30E0A1',
      name: 'Imbalance Long Ratio',
      isPercentage: true,
    },
  ]

  const handleRefetch = async () => {
    await mutate(['perps/perpsGlobalStats'], undefined, { revalidate: true })
  }

  if (perpsGlobalStatsLoading)
    return (
      <div className='h-100 w-full flex items-center justify-center'>
        <div className='flex flex-wrap items-center justify-center'>
          <CircularProgress size={60} />
          <Text size='xl' className='w-full text-center'>
            Fetching data...
          </Text>
        </div>
      </div>
    )
  if (!perpsGlobalStats || error) return <ChartError handleRefetch={handleRefetch} />

  return (
    <div className='flex flex-col gap-4'>
      <StatisticsPanel data={perpsGlobalStats} loading={perpsGlobalStatsLoading} />
      <div className='flex gap-2'>
        <div className='w-1/2'>
          <SynchronizedAreaChart
            data={pnlData}
            title='Realized and Unrealized PnL'
            loading={perpsGlobalStatsLoading}
            dataKey1='Realized'
            dataKey2='Unrealized'
          />
        </div>
        <div className='w-1/2 flex flex-col gap-2'>
          <DynamicLineChart
            data={feesData}
            lines={lineConfigsTradingFees}
            height='h-65'
            title='Trading and Net Funding Fees'
          />
          <DynamicLineChart
            data={imbalanceRatioData}
            lines={lineConfigsImbalanceRatio}
            height='h-65'
            title='Imbalance Long Ratio'
          />
        </div>
      </div>
      <div className='flex gap-2'>
        <DynamicLineChart
          data={notionalLiquidatedData}
          lines={lineConfigsNotional}
          height='h-65'
          title='Notional Liquidated'
        />
        <DynamicLineChart data={skewData} lines={lineConfigsSkew} height='h-65' title='Skew' />
      </div>
      <BarChart
        data={openInterestData}
        series={[
          {
            key: 'long',
            dataKey: 'long',
            displayName: 'Long',
            color: '#30E0A1',
          },
          {
            key: 'short',
            dataKey: 'short',
            displayName: 'Short',
            color: '#AB47BC',
          },
        ]}
        title='Open Interest Long/Short'
        stacked={false}
        height={300}
      />

      <DynamicLineChart
        data={dailyTradingVolumeData}
        lines={lineConfigsTradingVolume}
        height='h-75'
        title='Daily Trading Volume'
      />

      <DynamicLineChart data={vaultData} lines={lineConfigsVault} height='h-75' title='Vault' />
    </div>
  )
}
