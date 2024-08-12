import { useMemo, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import Table from 'components/common/Table'
import useAssets from 'hooks/assets/useAssets'
import useLiquidations from 'hooks/liquidations/useLiquidations'
import CustomAssetCell from 'components/main/Liquidations/Table/CustomAssetCell'
import CustomAccountCell from './CustomAccountCell'
import CustomLiquidationPriceCell from './CustomLiquidationPriceCell'
import Pagination from './Pagination'
import { CircularProgress } from 'components/common/CircularProgress'
import Text from 'components/common/Text'

export default function LiquidationsTable() {
  const [page, setPage] = useState<number>(1)
  const pageSize = 25
  const maxEntries = 1_000

  const { data: liquidityData, isLoading: isLiquidityDataLoading } = useLiquidations(page, pageSize)
  const { data: assetsData } = useAssets()

  const totalPages = Math.ceil(maxEntries / pageSize)

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const columns = useMemo<ColumnDef<LiquidationDataItem>[]>(
    () => [
      {
        accessorKey: 'account_id',
        header: 'Account ID',
        cell: ({ row }) => {
          return <CustomAccountCell value={row.original.account_id as string} />
        },
      },
      {
        accessorKey: 'collateral_asset_won',
        header: 'Liquidated Collateral',
        cell: ({ row }) => {
          return (
            <CustomAssetCell
              value={row.original.collateral_asset_won as BNCoin}
              assetData={assetsData}
            />
          )
        },
      },
      {
        accessorKey: 'debt_asset_repaid',
        header: 'Repaid Debt',
        cell: ({ row }) => {
          return (
            <CustomAssetCell
              value={row.original.debt_asset_repaid as BNCoin}
              assetData={assetsData}
            />
          )
        },
      },
      // will be updated once we have the data
      {
        accessorKey: 'protocol_fee_coin',
        header: 'Liquidation Price',
        cell: ({ row }) => {
          return <CustomLiquidationPriceCell value={row.original} />
        },
      },
      {
        accessorKey: 'protocol_fee_coin',
        header: 'Protocol Fee',
        cell: ({ row }) => {
          return (
            <CustomAssetCell
              value={row.original.protocol_fee_coin as BNCoin}
              assetData={assetsData}
            />
          )
        },
      },
    ],
    [assetsData],
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
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}
    </>
  )
}