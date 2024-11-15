import BarChart from 'components/common/Chart/BarChart'
import StatisticsPanel from 'components/main/perps/perpsMarketStats/StatisticsPanel'
import DynamicLineChart from 'components/common/Chart/DynamicLineChart'
import SynchronizedAreaChart from 'components/common/Chart/SynchronizedAreaChart'
import ChartError from 'components/common/Chart/common/ChartError'
import Text from 'components/common/Text'
import usePerpsStats from 'hooks/perps/usePerpsGlobalStats'
import { CircularProgress } from 'components/common/CircularProgress'
import { mutate } from 'swr'
import { usePerpsChartData } from 'hooks/perps/usePerpsChartData'
import { DEFAULT_PERPS_GLOBAL_DATA, PERPS_LINE_CONFIGS } from 'constants/perpsChartData'

interface Props {
  timeframe: string
  selectedOption: string
}

export default function PerpsMarketStats(props: Props) {
  const { timeframe, selectedOption } = props
  const {
    data: perpsStats,
    isLoading: perpsStatsLoading,
    error,
  } = usePerpsStats(selectedOption, timeframe)

  const {
    openInterestData,
    oiRatioData,
    fundingRateData,
    pnlData,
    feesData,
    imbalanceRatioData,
    skewData,
    notionalLiquidatedData,
    dailyTradingVolumeData,
    vaultData,
  } = usePerpsChartData(perpsStats || DEFAULT_PERPS_GLOBAL_DATA)

  const handleRefetch = async () => {
    await mutate(['perps/stats', selectedOption, timeframe], undefined, { revalidate: true })
  }

  const isGlobalStats = selectedOption === 'total'

  if (perpsStatsLoading)
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
  if (!perpsStats || error) return <ChartError handleRefetch={handleRefetch} />

  console.log(imbalanceRatioData, 'imbalanceRatioData')
  // console.log(openInterestData, 'openInterestData')
  return (
    <div className='flex flex-col gap-4'>
      <StatisticsPanel data={perpsStats} loading={perpsStatsLoading} />
      <div className='flex gap-2'>
        <div className='w-1/2'>
          <SynchronizedAreaChart
            data={pnlData}
            title='Realized and Unrealized PnL'
            loading={perpsStatsLoading}
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
          {isGlobalStats && (
            <DynamicLineChart
              data={imbalanceRatioData}
              lines={[PERPS_LINE_CONFIGS.imbalanceRatio[0]]} // Only imbalance ratio
              height='h-65'
              title='Imbalance Long Ratio'
            />
          )}
          {!isGlobalStats && (
            <DynamicLineChart
              data={imbalanceRatioData}
              lines={PERPS_LINE_CONFIGS.imbalanceRatio} //imbalance and max skew ratio
              height='h-65'
              title='Imbalance Long Ratio'
            />
          )}
        </div>
      </div>
      <div className='flex gap-2'>
        {isGlobalStats && (
          <DynamicLineChart
            data={notionalLiquidatedData}
            lines={PERPS_LINE_CONFIGS.notional}
            height='h-65'
            title='Notional Liquidated'
          />
        )}
        {!isGlobalStats && (
          <DynamicLineChart
            data={oiRatioData}
            lines={PERPS_LINE_CONFIGS.oiRatios}
            height='h-65'
            title='OI to Max OI Ratios'
          />
        )}
        {!isGlobalStats && (
          <DynamicLineChart
            data={fundingRateData}
            lines={PERPS_LINE_CONFIGS.fundingRate}
            height='h-65'
            title='Funding Rate'
          />
        )}
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

      {isGlobalStats && (
        <DynamicLineChart
          data={vaultData}
          lines={PERPS_LINE_CONFIGS.vault}
          height='h-75'
          title='Vault'
        />
      )}
    </div>
  )
}
