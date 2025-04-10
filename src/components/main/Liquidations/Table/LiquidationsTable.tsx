import Account from 'components/main/Liquidations/Table/Cell/Account'
import Asset from 'components/main/Liquidations/Table/Cell/Asset'
import LiquidationPrice from 'components/main/Liquidations/Table/Cell/LiquidationPrice'
import Pagination from 'components/main/Liquidations/Table/Pagination'
import Table from 'components/common/Table'
import Text from 'components/common/Text'
import Timestamp from 'components/main/Liquidations/Table/Cell/Timestamp'
import Transaction from 'components/main/Liquidations/Table/Cell/Transaction'
import useAssets from 'hooks/assets/useAssets'
import useLiquidations from 'hooks/liquidations/useLiquidations'
import { CircularProgress } from 'components/common/CircularProgress'
import { ColumnDef, Row } from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'
import useChainConfig from 'hooks/chain/useChainConfig'

export default function LiquidationsTable() {
  const [page, setPage] = useState<number>(1)
  const pageSize = 25
  const chainConfig = useChainConfig()

  useEffect(() => {
    setPage(1)
  }, [chainConfig.id])

  const { data: liquidations, isLoading: isLiquidationsDataLoading } = useLiquidations(
    page,
    pageSize,
  )
  const { data: assetsData, isLoading: isAssetsLoading } = useAssets()

  const maxEntries = liquidations?.total ?? 0
  const totalPages = Math.ceil(maxEntries / pageSize)

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const isLoading = (!liquidations && isLiquidationsDataLoading) || (!assetsData && isAssetsLoading)

  const columns = useMemo<ColumnDef<LiquidationDataItem>[]>(() => {
    const baseColumns = [
      {
        header: 'Time',
        meta: { className: 'min-w-20' },
        cell: ({ row }: { row: Row<LiquidationDataItem> }) => (
          <Timestamp value={row.original.timestamp as string} />
        ),
      },
      {
        header: 'Account ID',
        cell: ({ row }: { row: Row<LiquidationDataItem> }) => (
          <Account value={row.original.liquidatee_account_id as string} />
        ),
      },
      {
        header: 'Liquidated Collateral',
        cell: ({ row }: { row: Row<LiquidationDataItem> }) => (
          <Asset value={row.original.collateral_asset_won as BNCoin} assetData={assetsData} />
        ),
      },
      {
        header: 'Liquidation Price',
        cell: ({ row }: { row: Row<LiquidationDataItem> }) => (
          <LiquidationPrice value={row.original} />
        ),
      },
      {
        header: 'Repaid Debt',
        cell: ({ row }: { row: Row<LiquidationDataItem> }) => (
          <Asset
            value={row.original.debt_asset_repaid as BNCoin}
            assetData={assetsData}
            historicalPrice={row.original.price_debt_repaid}
          />
        ),
      },
      {
        header: 'Protocol Fee',
        cell: ({ row }: { row: Row<LiquidationDataItem> }) => (
          <Asset
            value={row.original.protocol_fee_coin as BNCoin}
            assetData={assetsData}
            historicalPrice={row.original.price_protocol_fee_coin}
          />
        ),
      },
      {
        header: 'Transaction',
        cell: ({ row }: { row: Row<LiquidationDataItem> }) => (
          <Transaction value={row.original.tx_hash as string} />
        ),
      },
    ]
    return baseColumns
  }, [assetsData])

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

  if (!liquidations?.data?.length) {
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
        data={liquidations.data}
        tableBodyClassName='text-lg'
        initialSorting={[]}
      />

      {totalPages > 1 && (
        <Pagination currentPage={page} onPageChange={handlePageChange} totalPages={totalPages} />
      )}
    </>
  )
}
