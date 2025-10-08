import Card from 'components/common/Card'
import ChartError from 'components/common/Chart/common/ChartError'
import TimeframeSelector from 'components/common/Chart/common/SelectionControlPanel/TimeframeSelector'
import DynamicLineChart from 'components/common/Chart/DynamicLineChart'
import Divider from 'components/common/Divider'
import Text from 'components/common/Text'
import BurnSources from 'components/main/tokenomics/BurnSources'
import { TOKENOMICS_CHART_CONFIGS } from 'constants/chartData'
import { TOKENOMICS_TIMEFRAME } from 'constants/timeframe'
import { useTokenomicsChartData } from 'hooks/tokenomics/useTokenomicsChartData'
import useTokenomicsData from 'hooks/tokenomics/useTokenomicsData'
import { useMemo, useState } from 'react'

export default function TokenomicsCharts() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>(TOKENOMICS_TIMEFRAME[1].value)

  const {
    data: tokenomicsData,
    isLoading: isTokenomicsDataLoading,
    error,
    mutate,
  } = useTokenomicsData(selectedTimeframe)
  const { burnedData, liquidityData, treasuryData } = useTokenomicsChartData(tokenomicsData ?? null)

  // Custom Y-axis domain function (no zero clamp)
  const customYAxisDomain = useMemo(() => {
    return (values: number[]) => {
      const min = Math.min(...values)
      const max = Math.max(...values)
      const padding = (max - min) * 0.1
      return [min - padding, max + padding] as [number, number]
    }
  }, [])

  const handleRefetch = async () => {
    await mutate()
  }

  const isLoadingCharts = isTokenomicsDataLoading || !burnedData || !liquidityData || !treasuryData

  // Baselines (earliest points) for left (amount) and right (USD) axes
  const burnedBaselineLeft = burnedData?.[0]?.burned_amount
  const burnedBaselineRight = burnedData?.[0]?.burned_value_usd
  const liquidityBaselineRight = liquidityData?.[0]?.liquidity_usd
  const treasuryBaselineLeft = treasuryData?.[0]?.treasury_amount
  const treasuryBaselineRight = treasuryData?.[0]?.treasury_value_usd

  // Single domain function applied to all axes: 10% below min (clamped at 0) to max + 10%
  const commonDomain = useMemo<(values: number[]) => [number, number]>(() => {
    return (values: number[]) => {
      const min = Math.min(...values)
      const max = Math.max(...values)
      const padding = (max - min) * 0.1
      return [Math.max(0, min - padding), max + padding] as [number, number]
    }
  }, [])

  return (
    <Card className='p-4 w-full md:p-6 bg-white/5'>
      <div className='flex flex-col gap-6'>
        <div className='flex flex-wrap justify-between items-center'>
          <Text className='pb-2'>Tokenomics Data</Text>
          <TimeframeSelector
            timeframe={TOKENOMICS_TIMEFRAME}
            selectedTimeframe={selectedTimeframe}
            setSelectedTimeframe={setSelectedTimeframe}
            className='!my-0 pb-2'
          />
        </div>
        <Divider />
        {error ? (
          <ChartError handleRefetch={handleRefetch} />
        ) : (
          <div className='space-y-6'>
            <DynamicLineChart
              data={burnedData ?? []}
              loading={isLoadingCharts}
              lines={TOKENOMICS_CHART_CONFIGS.burned}
              height='h-100'
              title='Burned MARS Supply'
              customYAxisDomain={customYAxisDomain}
              timeframe={selectedTimeframe}
              baselineLeft={burnedBaselineLeft}
              baselineRight={burnedBaselineRight}
              leftDomainFn={commonDomain}
              rightDomainFn={commonDomain}
            />

            <BurnSources />

            <DynamicLineChart
              data={liquidityData ?? []}
              loading={isLoadingCharts}
              lines={TOKENOMICS_CHART_CONFIGS.liquidity}
              height='h-100'
              title='MARS On-Chain Liquidity on Astroport'
              customYAxisDomain={customYAxisDomain}
              timeframe={selectedTimeframe}
              baselineRight={liquidityBaselineRight}
              rightDomainFn={commonDomain}
            />

            <DynamicLineChart
              data={treasuryData ?? []}
              loading={isLoadingCharts}
              lines={TOKENOMICS_CHART_CONFIGS.treasury}
              height='h-100'
              title='DAO Treasury'
              customYAxisDomain={customYAxisDomain}
              timeframe={selectedTimeframe}
              baselineLeft={treasuryBaselineLeft}
              baselineRight={treasuryBaselineRight}
              leftDomainFn={commonDomain}
              rightDomainFn={commonDomain}
            />
          </div>
        )}
      </div>
    </Card>
  )
}
