import Table from 'components/common/Table'
import FormattedCell from 'components/main/Liquidations/FormattedCell'
import useAssets from 'hooks/assets/useAssets'
import useLiquidations from 'hooks/liquidations/useLiquidations'
import { useMemo } from 'react'
import { getCoinValue } from 'utils/formatters'
import CustomAssetCell from './CustomAssetCell'
interface Cell {
  getValue: () => BNCoin
}

export default function LiquidationsTable() {
  const { data: liquidityData, isLoading: isLiquidityDataLoading } = useLiquidations()
  const { data: assetsData } = useAssets()

  const filteredData = useMemo(() => {
    if (liquidityData && assetsData) {
      return liquidityData.data.filter((data) => {
        console.log(data, 'data')
        const dollarValue = getCoinValue(data.collateral_asset_won, assetsData)
        return dollarValue.toNumber() > 10
      })
    }
    return []
  }, [liquidityData, assetsData])

  const columns = useMemo(
    () => [
      {
        accessorKey: 'account_id',
        header: 'Account ID',
      },
      {
        accessorKey: 'collateral_asset_won',
        header: 'Collateral Asset Amount',
        cell: (props: Cell) => {
          return <CustomAssetCell value={props.getValue()} assetsData={assetsData} />
        },
      },
      {
        accessorKey: 'debt_asset_repaid',
        header: 'Debt Asset Amount',
        cell: (props: Cell) => {
          return <FormattedCell value={props.getValue()} assetsData={assetsData} />
        },
      },
      {
        accessorKey: 'protocol_fee_coin',
        header: 'Protocol Fee Amount',
        cell: (props: Cell) => {
          return <FormattedCell value={props.getValue()} assetsData={assetsData} />
        },
      },
    ],
    [assetsData],
  )

  return (
    <>
      {isLiquidityDataLoading ? (
        <div>Fetching Data...</div>
      ) : (
        <Table
          title='Recently Executed Liquidations'
          columns={columns}
          data={filteredData}
          initialSorting={[]}
        />
      )}
    </>
  )
}
