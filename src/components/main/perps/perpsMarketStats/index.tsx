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
import {
  DEFAULT_PERPS_GLOBAL_DATA,
  FUNDING_RATE_OPTIONS,
  FundingRateTimeBase,
  PERPS_LINE_CONFIGS,
} from 'constants/perpsChartData'
import MultipleAxisChart from 'components/common/Chart/MultipleAxisChart'
import TimeframeSelector from 'components/common/Chart/common/SelectionControlPanel/TimeframeSelector'
import { useMemo, useState } from 'react'
import { BN } from 'utils/helpers'
import ComposedChart from 'components/common/Chart/ComposedChart'

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
    combinedMetricsData,
  } = usePerpsChartData(perpsStats || DEFAULT_PERPS_GLOBAL_DATA)
  const [timeBase, setTimeBase] = useState<FundingRateTimeBase>(FundingRateTimeBase.YEARLY)

  const handleRefetch = async () => {
    await mutate(['perps/stats', selectedOption, timeframe], undefined, { revalidate: true })
  }

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

  return (
    <div className='flex flex-col gap-4'>
      <StatisticsPanel data={perpsStats} loading={perpsStatsLoading} />
      <div className='flex gap-2'>
        <div className='w-1/2 flex flex-col gap-2'>
          <DynamicLineChart
            data={dailyTradingVolumeData}
            lines={PERPS_LINE_CONFIGS.tradingVolume}
            height='h-70'
            title='Daily Trading Volume'
          />
          {!isGlobalStats && (
            <DynamicLineChart
              data={transformedFundingRateData}
              lines={[
                {
                  ...PERPS_LINE_CONFIGS.fundingRate[0],
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
                    className='my-0'
                  />
                </div>
              }
            />
          )}
          {isGlobalStats && (
            <DynamicLineChart
              data={notionalLiquidatedData}
              lines={PERPS_LINE_CONFIGS.notional}
              height='h-70'
              title='Notional Liquidated'
            />
          )}
        </div>
        <div className='w-1/2 flex flex-col gap-2'>
          <DynamicLineChart
            data={feesData}
            lines={PERPS_LINE_CONFIGS.tradingFees}
            height='h-70'
            title='Trading and Net Funding Fees'
          />
          <DynamicLineChart
            data={imbalanceRatioData}
            lines={[PERPS_LINE_CONFIGS.imbalanceRatio[0]]} // Only imbalance ratio
            height='h-70'
            title='Imbalance Long Ratio'
          />

          {/* {!isGlobalStats && (
            <DynamicLineChart
              data={imbalanceRatioData}
              lines={PERPS_LINE_CONFIGS.imbalanceRatio} //imbalance and max skew ratio
              height='h-65'
              title='Imbalance Long Ratio'
            />
          )} */}
        </div>
      </div>
      <div className='flex gap-2'>
        {isGlobalStats && (
          <DynamicLineChart
            data={notionalLiquidatedData}
            lines={PERPS_LINE_CONFIGS.notional}
            height='h-70'
            title='Notional Liquidated'
          />
        )}
        {!isGlobalStats && (
          <DynamicLineChart
            data={oiRatioData}
            lines={PERPS_LINE_CONFIGS.oiRatios}
            height='h-70'
            title='OI to Max OI Ratios'
          />
        )}

        <DynamicLineChart
          data={skewData}
          lines={PERPS_LINE_CONFIGS.skew}
          height='h-70'
          title='Skew'
        />
      </div>
      <BarChart
        data={openInterestData}
        series={[
          {
            key: 'short',
            dataKey: 'short',
            displayName: 'Short',
            color: 'rgba(171, 66, 188, 0.6)',
          },
          {
            key: 'long',
            dataKey: 'long',
            displayName: 'Long',
            color: 'rgba(48, 224, 161, 0.7)',
          },
        ]}
        title='Open Interest Long/Short'
        stacked={true}
        height={300}
      />

      {/* <MultipleAxisChart
        data={transformedPnlData}
        title='Realized and Unrealized PnL'
        loading={perpsStatsLoading}
        primaryAxis={{
          series: [
            {
              type: 'bar',
              dataKey: 'Realized_daily',
              name: 'Daily Realized PnL Change',
              color: '#82ca9d',
            },
            {
              type: 'bar',
              dataKey: 'Unrealized_daily',
              name: 'Daily Unrealized PnL Change',
              color: '#AB47BC',
            },
          ],
        }}
        secondaryAxis={{
          series: [
            {
              type: 'line',
              dataKey: 'Realized',
              name: 'Cumulative Realized PnL',
              color: '#82ca9d',
            },
            {
              type: 'line',
              dataKey: 'Unrealized',
              name: 'Cumulative Unrealized PnL',
              color: '#AB47BC',
            },
          ],
        }}
        height='h-100'
      /> */}
      <SynchronizedAreaChart
        data={pnlData}
        title='Realized and Unrealized PnL'
        loading={perpsStatsLoading}
        dataKey1='Realized'
        dataKey2='Unrealized'
      />
      <ComposedChart
        data={pnlData}
        title='Realized and Unrealized PnL'
        loading={perpsStatsLoading}
        dataKey1='Realized'
        dataKey2='Unrealized'
      />

      {/* {!isGlobalStats && (
        <MultipleAxisChart
          data={openInterestData}
          primaryAxis={{
            series: [
              {
                type: 'line',
                dataKey: 'long',
                name: 'Long',
                color: '#30E0A1',
              },
              {
                type: 'line',
                dataKey: 'short',
                name: 'Short',
                color: '#AB47BC',
              },
            ],
          }}
          secondaryAxis={{
            series: [
              {
                type: 'line',
                dataKey: 'long_ratio',
                name: 'Long/Max Ratio',
                color: '#FAdf', // Added a new color for distinction
                isPercentage: true,
              },
              {
                type: 'line',
                dataKey: 'short_ratio',
                name: 'Short/Max Ratio',
                color: '#FF8C00', // Added a new color for distinction
                isPercentage: true,
              },
            ],
          }}
          height={'h-100'}
          title='Open Interest and Max OI Ratios'
        />
      )} */}
      {/* {!isGlobalStats && (
        <MultipleAxisChart
          data={skewData}
          title='Skew and MaxSkew Ratio'
          loading={perpsStatsLoading}
          primaryAxis={{
            series: [
              {
                type: 'line',
                dataKey: 'skew',
                name: 'Skew',
                color: '#AB47BC',
              },
            ],
          }}
          secondaryAxis={{
            series: [
              {
                type: 'line',
                dataKey: 'maxskew_ratio',
                name: 'MaxSkew Ratio',
                color: '#30E0A1',
                isPercentage: true,
              },
            ],
          }}
          height='h-100'
        />
      )} */}

      {/* {!isGlobalStats && (
        <MultipleAxisChart
          data={combinedMetricsData}
          title='Skew, MaxSkew Ratio and Funding Rate'
          loading={perpsStatsLoading}
          primaryAxis={{
            series: [
              {
                type: 'line',
                dataKey: 'skew',
                name: 'Skew',
                color: '#30E0A1',
              },
            ],
          }}
          secondaryAxis={{
            series: [
              {
                type: 'line',
                dataKey: 'maxskew_ratio',
                name: 'MaxSkew Ratio',
                color: '#AB47BC',
                isPercentage: true,
              },
              {
                type: 'line',
                dataKey: 'funding_rate',
                name: 'Funding Rate (Annualized)',
                color: '#580DA3',
                isPercentage: true,
              },
            ],
          }}
          height='h-100'
        />
      )} */}

      {isGlobalStats && (
        <div className='flex gap-2'>
          <DynamicLineChart
            data={vaultData}
            lines={PERPS_LINE_CONFIGS.vault}
            height='h-70'
            title='Vault'
          />
          <DynamicLineChart
            data={vaultData}
            lines={PERPS_LINE_CONFIGS.vaultCollateralization}
            height='h-70'
            title='Vault Collateralization Ratio'
          />
        </div>
      )}
    </div>
  )
}
