import useLiquidations from 'hooks/liquidations/useLiquidations'
import useOverviewData from 'hooks/tokenomics/useOverviewData'

export default function LiquidationsPage() {
  const { data: liquidityData, isLoading: isLiquidityDataLoading } = useLiquidations()
  const { data: liquidityOverviewData, isLoading: isLiquidityOverviewDataLoading } =
    useOverviewData()

  console.log(liquidityData, 'liquidityData')
  console.log(liquidityOverviewData, 'liquidityOverviewData')

  return (
    <div>
      <h1>Liquidations Page</h1>
    </div>
  )
}
