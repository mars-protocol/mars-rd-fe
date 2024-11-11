import usePerpsGlobalStats from 'hooks/perps/usePerpsGlobalStats'
import StatisticsPanel from 'components/main/perps/perpsMarketStats/StatisticsPanel'
import DynamicLineChart from 'components/common/Chart/DynamicLineChart'
import TabChart from 'components/main/overview/Chart/TabChart'
import SynchronizedAreaChart from 'components/common/Chart/SynchronizedAreaChart'
import { useMemo } from 'react'
import { mergeDateValueArrays, transformDateValueArray } from 'utils/helpers'

export default function PerpsMarketStats() {
  const { data: perpsGlobalStats, isLoading: perpsGlobalStatsLoading } = usePerpsGlobalStats()

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

  const lineConfigsOpenInterest = [
    { dataKey: 'long', color: '#AB47BC', name: 'Long' },
    { dataKey: 'short', color: '#580DA3', name: 'Short' },
    { dataKey: 'total', color: '#30E0A1', name: 'Total' },
  ]
  const lineConfigsTradingFees = [
    { dataKey: 'trading_fees', color: '#AB47BC', name: 'Trading Fees' },
    { dataKey: 'net_funding_fees', color: '#580DA3', name: 'Net Funding Fees' },
  ]

  if (!perpsGlobalStats) return []

  console.log(pnlData, 'pnlDatapnlDatapnlDatapnlDatav')
  return (
    <div className='flex flex-col gap-4'>
      <StatisticsPanel data={perpsGlobalStats} loading={perpsGlobalStatsLoading} />
      <div className='flex gap-2'>
        <div className='w-1/2'>
          <SynchronizedAreaChart
            data={pnlData}
            height='450px'
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
            height={200}
            title='Trading and Net Funding Fees'
          />
          <DynamicLineChart
            data={openInterestData}
            lines={lineConfigsOpenInterest}
            height={200}
            title='Open Interest'
          />
        </div>
        {/* <div className='flex-1 flex flex-col gap-4'>
                    <HorizontalBarChartBody />
                    <HorizontalBarChartBody />
                  </div> */}
        {/* </div> */}
      </div>
      <div className='flex gap-4 -mt-4'>
        <TabChart />
      </div>
    </div>
  )
}
