import Table from 'components/common/Table'
import FormattedCell from 'components/common/Table/FormattedCell'
import useAssets from 'hooks/assets/useAssets'
import useLiquidations from 'hooks/liquidations/useLiquidations'
import { useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'

interface Cell {
  getValue: () => BNCoin
}

export default function LiquidationsTable() {
  const { data: liquidityData, isLoading: isLiquidityDataLoading } = useLiquidations()
  const { data: assetsData } = useAssets()

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
          return <FormattedCell value={props.getValue()} assetsData={assetsData} />
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
        accessorKey: 'liquidation_type',
        header: 'Liquidation Type',
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
          title='Liquidations Data'
          columns={columns}
          data={liquidityData.data}
          initialSorting={[]}
        />
      )}
    </>
  )
}
