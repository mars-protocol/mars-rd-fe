import { PERPS_CHART_TRANSFORMATIONS } from 'constants/chartData'
import { useChartDataTransform } from 'hooks/charts/useChartDataTransform'

export const usePerpsChartData = (data: PerpsGlobalData | PerpsMarketData) => {
  const openInterestData = useChartDataTransform(data, PERPS_CHART_TRANSFORMATIONS.openInterest)
  const fundingRateData = useChartDataTransform(data, PERPS_CHART_TRANSFORMATIONS.fundingRate)
  const pnlData = useChartDataTransform(data, PERPS_CHART_TRANSFORMATIONS.pnl)
  const realizedPnlBreakdown = useChartDataTransform(
    data,
    PERPS_CHART_TRANSFORMATIONS.realizedPnlBreakdown,
  )
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
    realizedPnlBreakdown,
    feesData,
    skewData,
    notionalLiquidatedData: singleMetrics,
    tradingVolumeData: singleMetrics,
    imbalanceRatioData: singleMetrics,
    vaultData,
    combinedMetricsData,
  }
}
