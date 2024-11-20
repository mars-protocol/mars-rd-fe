import { PERPS_CHART_TRANSFORMATIONS } from 'constants/perpsChartData'
import { usePerpsChartDataTransform } from 'hooks/perps/usePerpsChartDataTransform'

export const usePerpsChartData = (data: PerpsGlobalData | PerpsMarketData) => {
  const openInterestData = usePerpsChartDataTransform(
    data,
    PERPS_CHART_TRANSFORMATIONS.openInterest,
  )
  const fundingRateData = usePerpsChartDataTransform(data, PERPS_CHART_TRANSFORMATIONS.fundingRate)
  const pnlData = usePerpsChartDataTransform(data, PERPS_CHART_TRANSFORMATIONS.pnl)
  const feesData = usePerpsChartDataTransform(data, PERPS_CHART_TRANSFORMATIONS.fees)
  const skewData = usePerpsChartDataTransform(data, PERPS_CHART_TRANSFORMATIONS.skewData)
  const vaultData = usePerpsChartDataTransform(data, PERPS_CHART_TRANSFORMATIONS.vaultData)
  const singleMetrics = usePerpsChartDataTransform(data, PERPS_CHART_TRANSFORMATIONS.singleMetrics)
  // const combinedMetricsData = usePerpsChartDataTransform(
  //   data,
  //   PERPS_CHART_TRANSFORMATIONS.combinedMetrics,
  // )

  console.log('singleMetrics', singleMetrics)
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
    // combinedMetricsData,
  }
}
