import { PERPS_CHART_TRANSFORMATIONS } from 'constants/perpsChartData'
import { usePerpsChartDataTransform } from 'hooks/perps/usePerpsChartDataTransform'

export const usePerpsChartData = (data: PerpsGlobalData | PerpsMarketData) => {
  const openInterestData = usePerpsChartDataTransform(
    data,
    PERPS_CHART_TRANSFORMATIONS.openInterest,
  )
  const oiRatioData = usePerpsChartDataTransform(data, PERPS_CHART_TRANSFORMATIONS.oiRatios)
  const fundingRateData = usePerpsChartDataTransform(data, PERPS_CHART_TRANSFORMATIONS.fundingRate)
  const pnlData = usePerpsChartDataTransform(data, PERPS_CHART_TRANSFORMATIONS.pnl)
  const feesData = usePerpsChartDataTransform(data, PERPS_CHART_TRANSFORMATIONS.fees)
  const skewData = usePerpsChartDataTransform(data, PERPS_CHART_TRANSFORMATIONS.skewData)
  const vaultData = usePerpsChartDataTransform(data, PERPS_CHART_TRANSFORMATIONS.vaultData)
  const otherMetrics = usePerpsChartDataTransform(data, PERPS_CHART_TRANSFORMATIONS.singleMetrics)
  const combinedMetricsData = usePerpsChartDataTransform(
    data,
    PERPS_CHART_TRANSFORMATIONS.combinedMetrics,
  )
  return {
    openInterestData,
    oiRatioData,
    fundingRateData,
    pnlData,
    feesData,
    imbalanceRatioData: skewData,
    skewData,
    notionalLiquidatedData: otherMetrics,
    dailyTradingVolumeData: otherMetrics,
    vaultData,
    combinedMetricsData,
  }
}
