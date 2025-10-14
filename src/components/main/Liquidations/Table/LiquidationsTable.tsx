import { ColumnDef, Row } from '@tanstack/react-table'
import { CircularProgress } from 'components/common/CircularProgress'
import { InfoCircle } from 'components/common/Icons'
import SearchBar from 'components/common/SearchBar'
import Table from 'components/common/Table'
import Text from 'components/common/Text'
import { Tooltip } from 'components/common/Tooltip'
import Account from 'components/main/Liquidations/Table/Cell/Account'
import Asset from 'components/main/Liquidations/Table/Cell/Asset'
import LiquidationFees from 'components/main/Liquidations/Table/Cell/LiquidationFees'
import LiquidationPrice from 'components/main/Liquidations/Table/Cell/LiquidationPrice'
import Timestamp from 'components/main/Liquidations/Table/Cell/Timestamp'
import Transaction from 'components/main/Liquidations/Table/Cell/Transaction'
import Pagination from 'components/main/Liquidations/Table/Pagination'
import useAssets from 'hooks/assets/useAssets'
import useChainConfig from 'hooks/chain/useChainConfig'
import useLiquidations from 'hooks/liquidations/useLiquidations'
import { useEffect, useMemo, useState } from 'react'

export default function LiquidationsTable() {
  const [page, setPage] = useState<number>(1)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('')
  const pageSize = 25
  const chainConfig = useChainConfig()

  useEffect(() => {
    setPage(1)
    setSearchQuery('')
  }, [chainConfig.id])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearchQuery])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const { data: liquidations, isLoading: isLiquidationsDataLoading } = useLiquidations(
    page,
    pageSize,
    debouncedSearchQuery,
  )
  const { data: assetsData, isLoading: isAssetsLoading } = useAssets()

  const maxEntries = liquidations?.total ?? 0
  const totalPages = Math.ceil(maxEntries / pageSize)

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const isLoading = (!liquidations && isLiquidationsDataLoading) || (!assetsData && isAssetsLoading)

  const titleComponent = (
    <div className='flex items-center justify-between w-full px-4 py-3 bg-surface-dark'>
      <Text size='base' className='font-semibold'>
        Recently Executed Liquidations
      </Text>
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder='Search by account ID...'
        className='w-80'
      />
    </div>
  )

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
          <Asset
            value={row.original.collateral_asset_won as BNCoin}
            assetData={assetsData}
            historicalPrice={row.original.price_liquidated}
          />
        ),
      },
      {
        header: 'Liquidation Price',
        cell: ({ row }: { row: Row<LiquidationDataItem> }) => (
          <LiquidationPrice value={row.original} />
        ),
      },
      {
        header: () => (
          <div className='flex items-center gap-1'>
            Protocol Fee
            <Tooltip
              type='info'
              content={
                <div className='flex flex-col gap-1'>
                  <Text size='xs' className='font-bold'>
                    Total liquidation fee is split as follows:
                  </Text>
                  <Text size='xs'>• 75% goes to the liquidator</Text>
                  <Text size='xs'>• 25% is protocol fee, which is further split:</Text>
                  <div className='pl-4'>
                    <Text size='xs'>- 45% Safety Fund</Text>
                    <Text size='xs'>- 45% Mars Buybacks</Text>
                    <Text size='xs'>- 10% Revenue Share</Text>
                  </div>
                </div>
              }
            >
              <InfoCircle className='w-3.5 h-3.5 text-white/40' />
            </Tooltip>
          </div>
        ),
        accessorKey: 'protocol_fee_coin',
        cell: ({ row }: { row: Row<LiquidationDataItem> }) => (
          <div className='flex justify-end items-start gap-1'>
            <Asset
              value={row.original.protocol_fee_coin as BNCoin}
              assetData={assetsData}
              historicalPrice={row.original.price_protocol_fee_coin}
            />
            <Tooltip
              type='info'
              content={<LiquidationFees protocolFee={row.original.protocol_fee_coin as BNCoin} />}
            >
              <InfoCircle className='w-3.5 h-3.5 text-white/40' />
            </Tooltip>
          </div>
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
    if (debouncedSearchQuery) {
      return (
        <>
          <Table
            title={titleComponent}
            columns={columns}
            data={[]}
            tableBodyClassName='text-lg'
            initialSorting={[]}
          />
          <div className='flex flex-wrap justify-center w-full gap-4 py-8'>
            <Text className='w-full text-center' size='lg'>
              No liquidations found for account ID &quot;{debouncedSearchQuery}&quot;
            </Text>
          </div>
        </>
      )
    }
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
        title={titleComponent}
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
