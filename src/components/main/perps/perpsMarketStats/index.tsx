import StatisticsPanel from 'components/main/perps/perpsMarketStats/StatisticsPanel'
import DynamicLineChart from 'components/common/Chart/DynamicLineChart'
import SynchronizedChart from 'components/common/Chart/SynchronizedChart'
import ChartError from 'components/common/Chart/common/ChartError'
import Text from 'components/common/Text'
import usePerpsStats from 'hooks/perps/usePerpsGlobalStats'
import { CircularProgress } from 'components/common/CircularProgress'
import { mutate } from 'swr'
import { usePerpsChartData } from 'hooks/perps/usePerpsChartData'
import {
  DEFAULT_PERPS_GLOBAL_DATA,
  FUNDING_RATE_OPTIONS,
  PERPS_CHART_CONFIGS,
} from 'constants/chartData'
import TimeframeSelector from 'components/common/Chart/common/SelectionControlPanel/TimeframeSelector'
import { useMemo, useState } from 'react'
import { BN } from 'utils/helpers'
import ComposedChart from 'components/common/Chart/ComposedChart'
import { FundingRateTimeBase } from 'types/enums'

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
    fundingRateData,
    pnlData,
    feesData,
    skewData,
    imbalanceRatioData,
    notionalLiquidatedData,
    dailyTradingVolumeData,
    vaultData,
    combinedMetricsData,
  } = usePerpsChartData(perpsStats || DEFAULT_PERPS_GLOBAL_DATA)
  const [timeBase, setTimeBase] = useState<FundingRateTimeBase>(FundingRateTimeBase.YEARLY)

  const handleRefetch = async () => {
    await mutate(['perps/stats', selectedOption, timeframe], undefined, { revalidate: true })
  }

  const isGlobalStats = selectedOption === 'total'
  const transformedFundingRateData = useMemo(() => {
    return fundingRateData.map((item) => ({
      ...item,
      funding_rate: BN(item.funding_rate)
        .multipliedBy(
          timeBase === FundingRateTimeBase.HOURLY
            ? BN(1).dividedBy(24)
            : timeBase === FundingRateTimeBase.DAILY
              ? BN(1)
              : BN(365),
        )
        .toString(),
    }))
  }, [fundingRateData, timeBase])

  const transformedPnLData = useMemo(() => {
    const { primaryChart, secondaryChart } = PERPS_CHART_CONFIGS.pnl

    return pnlData.map((item, index) => {
      const prevItem = index < pnlData.length - 1 ? pnlData[index + 1] : null

      return {
        date: item.date,
        [primaryChart.line.dataKey]: item.realized,
        [primaryChart.bar.dataKey]: prevItem
          ? BN(item.realized).minus(prevItem.realized).toNumber()
          : 0,
        [secondaryChart.line.dataKey]: item.unrealized,
        [secondaryChart.bar.dataKey]: prevItem
          ? BN(item.unrealized).minus(prevItem.unrealized).toNumber()
          : 0,
      }
    })
  }, [pnlData])

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

  return (
    <div className='flex flex-col gap-4'>
      <StatisticsPanel data={perpsStats} loading={perpsStatsLoading} />
      <div className='flex gap-2'>
        <div className='w-1/2 flex flex-col gap-2'>
          <DynamicLineChart
            data={dailyTradingVolumeData}
            lines={PERPS_CHART_CONFIGS.tradingVolume}
            height='h-70'
            title='Daily Trading Volume'
          />
          {!isGlobalStats && (
            <DynamicLineChart
              data={transformedFundingRateData}
              lines={[
                {
                  ...PERPS_CHART_CONFIGS.fundingRate[0],
                  name: `Funding Rate (${timeBase})`,
                },
              ]}
              height='h-70'
              title={
                <div className='flex w-full justify-between items-center'>
                  <Text size='sm'>Funding Rate</Text>
                  <TimeframeSelector
                    timeframe={FUNDING_RATE_OPTIONS}
                    selectedTimeframe={timeBase}
                    setSelectedTimeframe={(value) => setTimeBase(value as FundingRateTimeBase)}
                    size='xs'
                  />
                </div>
              }
            />
          )}
          {isGlobalStats && (
            <DynamicLineChart
              data={notionalLiquidatedData}
              lines={PERPS_CHART_CONFIGS.notional}
              height='h-70'
              title='Notional Liquidated'
            />
          )}
        </div>
        <div className='w-1/2 flex flex-col gap-2'>
          <DynamicLineChart
            data={feesData}
            lines={PERPS_CHART_CONFIGS.tradingFees}
            height='h-70'
            title='Trading and Net Funding Fees'
          />
          <DynamicLineChart
            data={imbalanceRatioData}
            lines={PERPS_CHART_CONFIGS.imbalanceRatio}
            height='h-70'
            title='Imbalance Long Ratio'
          />
        </div>
      </div>
      <DynamicLineChart
        data={skewData}
        lines={PERPS_CHART_CONFIGS.skew}
        height='h-80'
        title='Skew'
      />
      <ComposedChart
        data={openInterestData}
        title='Open Interest and Max Net OI'
        loading={perpsStatsLoading}
        config={PERPS_CHART_CONFIGS.openInterest}
        height='h-80'
      />
      <SynchronizedChart
        data={transformedPnLData}
        title='Realized and Unrealized PnL'
        loading={perpsStatsLoading}
        config={PERPS_CHART_CONFIGS.pnl}
      />
      {!isGlobalStats && (
        <ComposedChart
          data={combinedMetricsData}
          title='Skew, Max Skew & Funding Rate'
          loading={perpsStatsLoading}
          config={PERPS_CHART_CONFIGS.combinedChart}
          height='h-80'
        />
      )}

      {isGlobalStats && (
        <div className='flex gap-2'>
          <DynamicLineChart
            data={vaultData}
            lines={PERPS_CHART_CONFIGS.vault}
            height='h-70'
            title='Vault'
          />
          <DynamicLineChart
            data={vaultData}
            lines={PERPS_CHART_CONFIGS.vaultCollateralization}
            height='h-70'
            title='Vault Collateralization Ratio'
          />
        </div>
      )}
    </div>
  )
}
