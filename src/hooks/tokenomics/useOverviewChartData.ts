import { OVERVIEW_CHART_TRANSFORMATIONS } from 'constants/chartData'
import { useChartDataTransform } from 'hooks/charts/useChartDataTransform'

export const useOverviewChartData = (data: OverviewData | null | undefined) => {
  const tvlData = useChartDataTransform(data, OVERVIEW_CHART_TRANSFORMATIONS.tvl)
  const supplyBorrowData = useChartDataTransform(data, OVERVIEW_CHART_TRANSFORMATIONS.supplyBorrow)

  return {
    tvlData,
    supplyBorrowData,
  }
}
