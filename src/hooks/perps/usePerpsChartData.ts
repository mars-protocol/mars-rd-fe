import { PERPS_CHART_TRANSFORMATIONS } from 'constants/chartData'
import { useChartDataTransform } from 'hooks/charts/useChartDataTransform'

export const usePerpsChartData = (data: PerpsGlobalData | PerpsMarketData) => {
  const openInterestData = useChartDataTransform(data, PERPS_CHART_TRANSFORMATIONS.openInterest)
  const fundingRateData = useChartDataTransform(data, PERPS_CHART_TRANSFORMATIONS.fundingRate)
  const pnlData = useChartDataTransform(data, PERPS_CHART_TRANSFORMATIONS.pnl)
  const feesData = useChartDataTransform(data, PERPS_CHART_TRANSFORMATIONS.fees)
  const skewData = useChartDataTransform(data, PERPS_CHART_TRANSFORMATIONS.skewData)
  const vaultData = useChartDataTransform(data, PERPS_CHART_TRANSFORMATIONS.vaultData)
  const singleMetrics = useChartDataTransform(data, PERPS_CHART_TRANSFORMATIONS.singleMetrics)
  const combinedMetricsData = useChartDataTransform(
    data,
    PERPS_CHART_TRANSFORMATIONS.combinedMetrics,
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
