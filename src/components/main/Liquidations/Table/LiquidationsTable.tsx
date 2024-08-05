import { useMemo } from 'react'
import Table from 'components/common/Table'
import useAssets from 'hooks/assets/useAssets'
import useLiquidations from 'hooks/liquidations/useLiquidations'
import { getCoinValue } from 'utils/formatters'
import CustomAssetCell from 'components/main/Liquidations/Table/CustomAssetCell'
import CustomAccountCell from './CustomAccountCell'

interface Cell {
  getValue: () => BNCoin
}

export default function LiquidationsTable() {
  const { data: liquidityData, isLoading: isLiquidityDataLoading } = useLiquidations()
  const { data: assetsData } = useAssets()

  const filteredData = useMemo(() => {
    if (liquidityData && assetsData) {
      return liquidityData.data.filter((data) => {
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
        cell: (props: Cell) => {
          return <CustomAccountCell value={props.getValue()} />
        },
      },
      {
        accessorKey: 'collateral_asset_won',
        header: 'Collateral Gained',
        cell: (props: Cell) => {
          return <CustomAssetCell value={props.getValue()} assetData={assetsData} />
        },
      },
      {
        accessorKey: 'debt_asset_repaid',
        header: 'Repaid Debt',
        cell: (props: Cell) => {
          return <CustomAssetCell value={props.getValue()} assetData={assetsData} />
        },
      },
      {
        accessorKey: 'protocol_fee_coin',
        header: 'Protocol Fee',
        cell: (props: Cell) => {
          return <CustomAssetCell value={props.getValue()} assetData={assetsData} />
        },
      },
      // will be added once we have the data
      // {
      //   accessorKey: 'protocol_fee_coin',
      //   header: 'Liquidation Price',
      //   cell: (props: Cell) => {
      //     return <CustomAssetCell value={props.getValue()} assetData={assetsData} />
      //   },
      // },
    ],
    [],
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
          tableBodyClassName='text-lg '
          initialSorting={[]}
          paginationRows={{ pageIndex: 0, pageSize: 15 }}
        />
      )}
    </>
  )
}
