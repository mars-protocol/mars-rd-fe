import { PERPS_CHART_TRANSFORMATIONS } from 'constants/chartData'
import { useChartDataTransform } from 'hooks/charts/useChartDataTransform'
import { useMemo } from 'react'

export const usePerpsChartData = (data: PerpsGlobalData | PerpsMarketData) => {
  const rawFeesData = useChartDataTransform(data, PERPS_CHART_TRANSFORMATIONS.fees)

  const validDates = useMemo(() => {
    const daysWithActivity = rawFeesData.filter(
      (day) => day.trading_fees !== 0 || day.net_funding_fees !== 0,
    )
    return new Set(
      daysWithActivity.length > 1
        ? rawFeesData
            .filter((day) => day.trading_fees !== 0 || day.net_funding_fees !== 0)
            .map((day) => day.date)
        : rawFeesData.map((day) => day.date),
    )
  }, [rawFeesData])

  const filterData = (data: MergedChartData[]) => {
    return validDates.size > 0 ? data.filter((item) => validDates.has(item.date)) : data
  }

  const openInterestData = filterData(
    useChartDataTransform(data, PERPS_CHART_TRANSFORMATIONS.openInterest),
  )
  const fundingRateData = filterData(
    useChartDataTransform(data, PERPS_CHART_TRANSFORMATIONS.fundingRate),
  )
  const pnlData = filterData(useChartDataTransform(data, PERPS_CHART_TRANSFORMATIONS.pnl))
  const feesData = filterData(useChartDataTransform(data, PERPS_CHART_TRANSFORMATIONS.fees))
  const skewData = filterData(useChartDataTransform(data, PERPS_CHART_TRANSFORMATIONS.skewData))
  const vaultData = filterData(useChartDataTransform(data, PERPS_CHART_TRANSFORMATIONS.vaultData))
  const singleMetrics = filterData(
    useChartDataTransform(data, PERPS_CHART_TRANSFORMATIONS.singleMetrics),
  )
  const combinedMetricsData = filterData(
    useChartDataTransform(data, PERPS_CHART_TRANSFORMATIONS.combinedMetrics),
  )

  return {
    openInterestData,
    fundingRateData,
    pnlData,
    feesData,
    skewData,
    notionalLiquidatedData: singleMetrics,
    dailyTradingVolumeData: singleMetrics,
    imbalanceRatioData: singleMetrics,
    vaultData,
    combinedMetricsData,
  }
}
