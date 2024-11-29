import Account from 'components/main/Liquidations/Table/Cell/Account'
import Asset from 'components/main/Liquidations/Table/Cell/Asset'
import Table from 'components/common/Table'
import LiquidationPrice from 'components/main/Liquidations/Table/Cell/LiquidationPrice'
import Pagination from 'components/main/Liquidations/Table/Pagination'
import Text from 'components/common/Text'
import Timestamp from 'components/main/Liquidations/Table/Cell/Timestamp'
import useAssets from 'hooks/assets/useAssets'
import useLiquidations from 'hooks/liquidations/useLiquidations'
import { useMemo, useState } from 'react'
import { CircularProgress } from 'components/common/CircularProgress'
import { ColumnDef, Row } from '@tanstack/react-table'
import { BN_ZERO } from 'constants/math'

export default function LiquidationsTable() {
  const [page, setPage] = useState<number>(1)
  const pageSize = 25
  const maxEntries = 200

  const { data: liquidityData, isLoading: isLiquidityDataLoading } = useLiquidations(page, pageSize)
  const { data: assetsData } = useAssets()

  const totalPages = Math.ceil(maxEntries / pageSize)

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const isLoading = isLiquidityDataLoading || !liquidityData

  const columns = useMemo<ColumnDef<LiquidationDataItem>[]>(() => {
    const hasNonZeroDebt =
      liquidityData?.some(
        (item: LiquidationDataItem) =>
          item.debt_asset_repaid?.amount && item.debt_asset_repaid.amount !== BN_ZERO,
      ) ?? false

    const baseColumns = [
      {
        header: 'Time',
        meta: { className: 'min-w-20' },
        cell: ({ row }: { row: Row<LiquidationDataItem> }) => {
          return <Timestamp value={row.original.timestamp as string} />
        },
      },
      {
        header: 'Account ID',
        cell: ({ row }: { row: Row<LiquidationDataItem> }) => {
          return <Account value={row.original.liquidatee_account_id as string} />
        },
      },
      {
        header: 'Liquidated Collateral',
        cell: ({ row }: { row: Row<LiquidationDataItem> }) => {
          return (
            <Asset value={row.original.collateral_asset_won as BNCoin} assetData={assetsData} />
          )
        },
      },
      ...(!hasNonZeroDebt
        ? [
            {
              header: 'Repaid Debt',
              cell: ({ row }: { row: Row<LiquidationDataItem> }) => {
                return (
                  <Asset value={row.original.debt_asset_repaid as BNCoin} assetData={assetsData} />
                )
              },
            },
          ]
        : []),
      {
        header: 'Liquidation Price',
        cell: ({ row }: { row: Row<LiquidationDataItem> }) => {
          return <LiquidationPrice value={row.original ?? 'N/A'} />
        },
      },
      {
        header: 'Protocol Fee',
        cell: ({ row }: { row: Row<LiquidationDataItem> }) => {
          return <Asset value={row.original.protocol_fee_coin as BNCoin} assetData={assetsData} />
        },
      },
    ]
    return baseColumns
  }, [assetsData, liquidityData])

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

  if (!liquidityData.length || liquidityData === null) {
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
        tableBodyClassName='text-lg'
        initialSorting={[]}
      />
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
    </>
  )
}
