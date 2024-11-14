import { PERPS_CHART_TRANSFORMATIONS } from 'constants/perpsChartData'
import { usePerpsChartDataTransform } from 'hooks/perps/usePerpsChartDataTransform'

export const usePerpsChartData = (data: PerpsGlobalData) => {
  const openInterestData = usePerpsChartDataTransform(
    data,
    PERPS_CHART_TRANSFORMATIONS.openInterest,
  )
  const pnlData = usePerpsChartDataTransform(data, PERPS_CHART_TRANSFORMATIONS.pnl)
  const feesData = usePerpsChartDataTransform(data, PERPS_CHART_TRANSFORMATIONS.fees)
  const skewData = usePerpsChartDataTransform(data, PERPS_CHART_TRANSFORMATIONS.skewData)
  const vaultData = usePerpsChartDataTransform(data, PERPS_CHART_TRANSFORMATIONS.vaultData)
  const otherMetrics = usePerpsChartDataTransform(data, PERPS_CHART_TRANSFORMATIONS.singleMetrics)

  return {
    openInterestData,
    pnlData,
    feesData,
    imbalanceRatioData: skewData,
    skewData,
    notionalLiquidatedData: otherMetrics,
    dailyTradingVolumeData: otherMetrics,
    vaultData,
  }
}
