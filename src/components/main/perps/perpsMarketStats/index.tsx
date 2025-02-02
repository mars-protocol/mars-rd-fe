import DynamicLineChart from 'components/common/Chart/DynamicLineChart'
import ChartError from 'components/common/Chart/common/ChartError'
import ComposedChart from 'components/common/Chart/ComposedChart'
import StatisticsPanel from 'components/main/perps/perpsMarketStats/StatisticsPanel'
import SynchronizedChart from 'components/common/Chart/SynchronizedChart'
import Text from 'components/common/Text'
import TimeframeSelector from 'components/common/Chart/common/SelectionControlPanel/TimeframeSelector'
import usePerpsStats from 'hooks/perps/usePerpsGlobalStats'
import { BN } from 'utils/helpers'
import { CircularProgress } from 'components/common/CircularProgress'
import { FundingRateTimeBase } from 'types/enums'
import { mutate } from 'swr'
import { useMemo, useState } from 'react'
import { usePerpsChartData } from 'hooks/perps/usePerpsChartData'
import {
  DEFAULT_PERPS_GLOBAL_DATA,
  FUNDING_RATE_OPTIONS,
  PERPS_CHART_CONFIGS,
} from 'constants/chartData'

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
    realizedPnlBreakdown,
    feesData,
    skewData,
    imbalanceRatioData,
    notionalLiquidatedData,
    tradingVolumeData,
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
        [primaryChart.bar.dataKey]: prevItem ? BN(item.realized).minus(prevItem.realized) : BN(0),
        [secondaryChart.line.dataKey]: item.unrealized,
        [secondaryChart.bar.dataKey]: prevItem
          ? BN(item.unrealized).minus(prevItem.unrealized)
          : BN(0),
      }
    })
  }, [pnlData])

  const totalPnlData = useMemo(() => {
    return pnlData.map((item) => {
      const netTotal = BN(item.realized).plus(BN(item.unrealized)).toNumber()
      return {
        ...item,
        netTotal,
      }
    })
  }, [pnlData])

  const netFundingFeesData = useMemo(() => {
    return feesData.map((item) => {
      const netFundingFees = BN(item.realized_net_funding_fees)
        .plus(BN(item.unrealized_net_funding_fees))
        .toNumber()

      return {
        ...item,
        netTotal: netFundingFees,
      }
    })
  }, [feesData])

  const realizedPnlBreakdownData = useMemo(() => {
    return realizedPnlBreakdown.map((item) => {
      const total = BN(item.realized_net_funding_fees)
        .plus(BN(item.realized_trading_fees))
        .plus(BN(item.realized_price_pnl))
        .toNumber()

      return {
        ...item,
        total,
      }
    })
  }, [realizedPnlBreakdown])

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
    <div className='w-full flex flex-col gap-4'>
      <StatisticsPanel data={perpsStats} loading={perpsStatsLoading} />

      <div className='flex flex-col md:flex-row gap-4'>
        <div className='w-full md:w-1/2'>
          <DynamicLineChart
            data={tradingVolumeData}
            lines={PERPS_CHART_CONFIGS.tradingVolume}
            height='h-80'
            title='Trading Volume'
            timeframe={timeframe}
          />
        </div>
        <div className='w-full md:w-1/2'>
          <DynamicLineChart
            data={feesData}
            lines={PERPS_CHART_CONFIGS.tradingFees}
            height='h-80'
            title='Cumulative Realized Trading and Funding Fees'
            timeframe={timeframe}
          />
        </div>
      </div>

      <div className='flex flex-col md:flex-row gap-4'>
        <div className='w-full md:w-1/2'>
          {!isGlobalStats ? (
            <DynamicLineChart
              data={transformedFundingRateData}
              lines={[
                {
                  ...PERPS_CHART_CONFIGS.fundingRate[0],
                  name: `Funding Rate (${timeBase})`,
                },
              ]}
              height='h-80'
              timeframe={timeframe}
              title={
                <div className='flex w-full justify-between items-center'>
                  <Text size='sm'>Funding Rate</Text>
                  <TimeframeSelector
                    timeframe={FUNDING_RATE_OPTIONS}
                    selectedTimeframe={timeBase}
                    setSelectedTimeframe={(value) => setTimeBase(value as FundingRateTimeBase)}
                    size='xs'
                    className='!my-0'
                  />
                </div>
              }
            />
          ) : (
            <DynamicLineChart
              data={notionalLiquidatedData}
              lines={PERPS_CHART_CONFIGS.notional}
              height='h-80'
              title='Notional Liquidated'
              timeframe={timeframe}
            />
          )}
        </div>
        <div className='w-full md:w-1/2'>
          <DynamicLineChart
            data={imbalanceRatioData}
            lines={PERPS_CHART_CONFIGS.imbalanceRatio}
            height='h-80'
            title='Imbalance Long Ratio'
            timeframe={timeframe}
          />
        </div>
      </div>

      <div className='flex flex-col md:flex-row gap-4'>
        <div className='w-full md:w-1/2'>
          <DynamicLineChart
            data={skewData}
            lines={PERPS_CHART_CONFIGS.skew}
            height='h-80'
            title='Skew and Max Net Open Interest'
            timeframe={timeframe}
          />
        </div>
        <div className='w-full md:w-1/2'>
          <ComposedChart
            data={openInterestData}
            title={isGlobalStats ? 'Open Interest' : 'Open Interest and Max Open Interest'}
            config={
              isGlobalStats
                ? PERPS_CHART_CONFIGS.openInterestGlobal
                : PERPS_CHART_CONFIGS.openInterest
            }
            height='h-80'
            timeframe={timeframe}
          />
        </div>
      </div>

      <SynchronizedChart
        data={transformedPnLData}
        title='Realized and Unrealized PnL'
        loading={perpsStatsLoading}
        config={PERPS_CHART_CONFIGS.pnl}
        timeframe={timeframe}
      />

      <div className='flex flex-col md:flex-row gap-4'>
        <div className='w-full md:w-1/2'>
          <DynamicLineChart
            data={totalPnlData}
            lines={PERPS_CHART_CONFIGS.totalPnl}
            height='h-80'
            title='Cumulative Total PnL'
            timeframe={timeframe}
          />
        </div>
        <div className='w-full md:w-1/2'>
          <DynamicLineChart
            data={netFundingFeesData}
            lines={PERPS_CHART_CONFIGS.netFundingFees}
            height='h-80'
            title='Cumulative Net Funding Fees'
            timeframe={timeframe}
          />
        </div>
      </div>
      <DynamicLineChart
        data={realizedPnlBreakdownData}
        lines={PERPS_CHART_CONFIGS.realizedPnlBreakdown}
        height='h-80'
        title='Vault Cumulative PnL Breakdown'
        timeframe={timeframe}
      />

      {!isGlobalStats && (
        <ComposedChart
          data={combinedMetricsData}
          title='Skew, Max Net Open Interest & Funding Rate'
          loading={perpsStatsLoading}
          config={PERPS_CHART_CONFIGS.combinedChart}
          height='h-90'
          timeframe={timeframe}
        />
      )}

      {isGlobalStats && (
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='w-full md:w-1/2'>
            <DynamicLineChart
              data={vaultData}
              lines={PERPS_CHART_CONFIGS.vault}
              height='h-80'
              title='Vault'
              customYAxisDomain={(values) => {
                const max = Math.max(...values)
                const min = Math.min(...values)
                const padding = (max - min) * 0.1 // 10% padding
                return [min - padding, max + padding]
              }}
              timeframe={timeframe}
            />
          </div>
          <div className='w-full md:w-1/2'>
            <DynamicLineChart
              data={vaultData}
              lines={PERPS_CHART_CONFIGS.vaultCollateralization}
              height='h-80'
              title='Vault Collateralization Ratio'
              timeframe={timeframe}
            />
          </div>
        </div>
      )}
    </div>
  )
}
