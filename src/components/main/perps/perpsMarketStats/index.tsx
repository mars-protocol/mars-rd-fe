import BarChart from 'components/common/Chart/BarChart'
import usePerpsGlobalStats from 'hooks/perps/usePerpsGlobalStats'
import StatisticsPanel from 'components/main/perps/perpsMarketStats/StatisticsPanel'
import DynamicLineChart from 'components/common/Chart/DynamicLineChart'
import SynchronizedAreaChart from 'components/common/Chart/SynchronizedAreaChart'
import ChartError from 'components/common/Chart/common/ChartError'
import Text from 'components/common/Text'
import { CircularProgress } from 'components/common/CircularProgress'
import { mutate } from 'swr'
import { usePerpsChartData } from 'hooks/perps/usePerpsChartData'
import { DEFAULT_PERPS_GLOBAL_DATA, PERPS_LINE_CONFIGS } from 'constants/perpsChartData'

interface Props {
  timeframe: string
}

export default function PerpsMarketStats(props: Props) {
  const { timeframe } = props
  const {
    data: perpsGlobalStats,
    isLoading: perpsGlobalStatsLoading,
    error,
  } = usePerpsGlobalStats(timeframe)

  const {
    openInterestData,
    pnlData,
    feesData,
    imbalanceRatioData,
    skewData,
    notionalLiquidatedData,
    dailyTradingVolumeData,
    vaultData,
  } = usePerpsChartData(perpsGlobalStats || DEFAULT_PERPS_GLOBAL_DATA)

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
            lines={PERPS_LINE_CONFIGS.tradingFees}
            height='h-65'
            title='Trading and Net Funding Fees'
          />
          <DynamicLineChart
            data={imbalanceRatioData}
            lines={PERPS_LINE_CONFIGS.imbalanceRatio}
            height='h-65'
            title='Imbalance Long Ratio'
          />
        </div>
      </div>
      <div className='flex gap-2'>
        <DynamicLineChart
          data={notionalLiquidatedData}
          lines={PERPS_LINE_CONFIGS.notional}
          height='h-65'
          title='Notional Liquidated'
        />
        <DynamicLineChart
          data={skewData}
          lines={PERPS_LINE_CONFIGS.skew}
          height='h-65'
          title='Skew'
        />
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
        lines={PERPS_LINE_CONFIGS.tradingVolume}
        height='h-75'
        title='Daily Trading Volume'
      />

      <DynamicLineChart
        data={vaultData}
        lines={PERPS_LINE_CONFIGS.vault}
        height='h-75'
        title='Vault'
      />
    </div>
  )
}
