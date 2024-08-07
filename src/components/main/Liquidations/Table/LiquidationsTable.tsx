import { useMemo } from 'react'
import Table from 'components/common/Table'
import useAssets from 'hooks/assets/useAssets'
import useLiquidations from 'hooks/liquidations/useLiquidations'
import { getCoinValue } from 'utils/formatters'
import CustomAssetCell from 'components/main/Liquidations/Table/CustomAssetCell'
import CustomAccountCell from './CustomAccountCell'
import CustomLiquidationPriceCell from './CustomLiquidationPriceCell'
import Pagination from './Pagination'

interface AssetCell {
  getValue: () => BNCoin
}
interface AccountCell {
  getValue: () => string
}

interface LiquidityData {
  account_id: string
  block_height: number
  collateral_asset_won: BNCoin
  debt_asset_repaid: BNCoin
  liquidation_type: string
  protocol_fee_coin: BNCoin
}

export default function LiquidationsTable() {
  const { data: liquidityData, isLoading: isLiquidityDataLoading } = useLiquidations()
  const { data: assetsData } = useAssets()

  const filteredData = useMemo(() => {
    if (liquidityData && assetsData) {
      return liquidityData.data.filter((data: LiquidityData) => {
        const dollarValue = getCoinValue(data.collateral_asset_won, assetsData)
        return dollarValue.toNumber() >= 10
      })
    }
    return []
  }, [liquidityData, assetsData])

  const columns = useMemo(
    () => [
      {
        accessorKey: 'account_id',
        header: 'Account ID',
        cell: (props: AccountCell) => {
          return <CustomAccountCell value={props.getValue()} />
        },
      },
      {
        accessorKey: 'collateral_asset_won',
        header: 'Liquidated Collateral',
        cell: (props: AssetCell) => {
          return <CustomAssetCell value={props.getValue()} assetData={assetsData} />
        },
      },
      {
        accessorKey: 'debt_asset_repaid',
        header: 'Repaid Debt',
        cell: (props: AssetCell) => {
          return <CustomAssetCell value={props.getValue()} assetData={assetsData} />
        },
      },
      // will be added once we have the data
      {
        accessorKey: 'protocol_fee_coin',
        header: 'Liquidation Price',
        cell: (props: AssetCell) => {
          return <CustomLiquidationPriceCell value={props.getValue()} />
        },
      },
      {
        accessorKey: 'protocol_fee_coin',
        header: 'Protocol Fee',
        cell: (props: AssetCell) => {
          return <CustomAssetCell value={props.getValue()} assetData={assetsData} />
        },
      },
    ],
    [],
  )

  return (
    <>
      {isLiquidityDataLoading ? (
        <div className='text-center'>Fetching Data...</div>
      ) : (
        <>
          <Table
            title='Recently Executed Liquidations'
            columns={columns}
            data={filteredData}
            tableBodyClassName='text-lg '
            initialSorting={[]}
            paginationRows={{ pageIndex: 0, pageSize: 15 }}
          />
          <Pagination />
        </>
      )}
    </>
  )
}
