import { useMemo, useState } from 'react'
import Table from 'components/common/Table'
import useAssets from 'hooks/assets/useAssets'
import useLiquidations from 'hooks/liquidations/useLiquidations'
import CustomAssetCell from 'components/main/Liquidations/Table/CustomAssetCell'
import CustomAccountCell from './CustomAccountCell'
import CustomLiquidationPriceCell from './CustomLiquidationPriceCell'
import Pagination from './Pagination'
import { CircularProgress } from 'components/common/CircularProgress'
import Text from 'components/common/Text'

interface AssetCell {
  getValue: () => BNCoin
}
interface AccountCell {
  getValue: () => string
}

export default function LiquidationsTable() {
  const [page, setPage] = useState<number>(1)
  const pageSize = 20

  const { data: liquidityData, isLoading: isLiquidityDataLoading } = useLiquidations(page, pageSize)
  const { data: assetsData } = useAssets()

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

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
      {isLiquidityDataLoading || !liquidityData.data ? (
        <div className='flex flex-wrap justify-center w-full gap-4'>
          <CircularProgress size={60} />
          <Text className='w-full text-center' size='xl'>
            Fetching data...
          </Text>
        </div>
      ) : (
        <>
          <Table
            title='Recently Executed Liquidations'
            columns={columns}
            data={liquidityData.data}
            tableBodyClassName='text-lg '
            initialSorting={[]}
          />
          <Pagination currentPage={page} totalPages={20} onPageChange={handlePageChange} />
        </>
      )}
    </>
  )
}
