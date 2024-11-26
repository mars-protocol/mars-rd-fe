import { ColumnDef } from '@tanstack/react-table'
import { CircularProgress } from 'components/common/CircularProgress'
import Table from 'components/common/Table'
import Text from 'components/common/Text'
import Account from 'components/main/Liquidations/Table/Cell/Account'
import Asset from 'components/main/Liquidations/Table/Cell/Asset'
import LiquidationPrice from 'components/main/Liquidations/Table/Cell/LiquidationPrice'
import Pagination from 'components/main/Liquidations/Table/Pagination'
import useAssets from 'hooks/assets/useAssets'
import useLiquidations from 'hooks/liquidations/useLiquidations'
import { useMemo, useState } from 'react'

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

  const tableData = liquidityData ?? []
  const isLoading = isLiquidityDataLoading || !liquidityData

  const columns = useMemo<ColumnDef<LiquidationDataItem>[]>(
    () => [
      {
        header: 'Account ID',
        cell: ({ row }) => {
          return <Account value={row.original.account_id as string} />
        },
      },
      {
        header: 'Liquidated Collateral',
        cell: ({ row }) => {
          return (
            <Asset value={row.original.collateral_asset_won as BNCoin} assetData={assetsData} />
          )
        },
      },
      {
        header: 'Repaid Debt',
        cell: ({ row }) => {
          return <Asset value={row.original.debt_asset_repaid as BNCoin} assetData={assetsData} />
        },
      },
      {
        header: 'Liquidation Price',
        cell: ({ row }) => {
          return <LiquidationPrice value={row.original ?? 'N/A'} />
        },
      },
      {
        header: 'Protocol Fee',
        cell: ({ row }) => {
          return <Asset value={row.original.protocol_fee_coin as BNCoin} assetData={assetsData} />
        },
      },
    ],
    [assetsData],
  )

  if (isLoading) {
    return (
      <div className='flex flex-wrap justify-center w-full gap-4'>
        <CircularProgress size={60} />
        <Text className='w-full text-center' size='xl'>
          Fetching data...
        </Text>
      </div>
    )
  }

  if (!tableData.length || tableData === null) {
    return (
      <div className='flex flex-wrap justify-center w-full gap-4'>
        <Text className='w-full text-center' size='xl'>
          No liquidation data available
        </Text>
      </div>
    )
  }

  return (
    <>
      <Table
        title='Recently Executed Liquidations'
        columns={columns}
        data={liquidityData}
        tableBodyClassName='text-lg '
        initialSorting={[]}
      />
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
    </>
  )
}
