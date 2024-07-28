import useLiquidations from 'hooks/liquidations/useLiquidations'

export default function LiquidationsTable() {
  const { data: liquidityData, isLoading: isLiquidityDataLoading } = useLiquidations()

  console.log(liquidityData, 'liquidityData')

  return (
    <>
      <h1>Table</h1>
    </>
  )
}
