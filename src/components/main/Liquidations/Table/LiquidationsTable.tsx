import { ColumnDef, OnChangeFn, Row, SortingState } from '@tanstack/react-table'
import BigNumber from 'bignumber.js'
import classNames from 'classnames'
import { CircularProgress } from 'components/common/CircularProgress'
import { Cross, InfoCircle } from 'components/common/Icons'
import SearchBar from 'components/common/SearchBar'
import Table from 'components/common/Table'
import Text from 'components/common/Text'
import { Tooltip } from 'components/common/Tooltip'
import Account from 'components/main/Liquidations/Table/Cell/Account'
import LiquidatedAsset from 'components/main/Liquidations/Table/Cell/LiquidatedAsset'
import LiquidationFees from 'components/main/Liquidations/Table/Cell/LiquidationFees'
import LiquidationPrice from 'components/main/Liquidations/Table/Cell/LiquidationPrice'
import Timestamp from 'components/main/Liquidations/Table/Cell/Timestamp'
import Transaction from 'components/main/Liquidations/Table/Cell/Transaction'
import Pagination from 'components/main/Liquidations/Table/Pagination'
import { PRICE_ORACLE_DECIMALS } from 'constants/query'
import useAssets from 'hooks/assets/useAssets'
import useChainConfig from 'hooks/chain/useChainConfig'
import useLiquidations from 'hooks/liquidations/useLiquidations'
import { useEffect, useMemo, useState } from 'react'
import { BN } from 'utils/helpers'

export default function LiquidationsTable() {
  const [page, setPage] = useState<number>(1)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('')
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])
  const [activeAccounts, setActiveAccounts] = useState<string[]>([])
  const [sorting, setSorting] = useState<SortingState>([{ id: 'timestamp', desc: true }])
  const [timestampOrder, setTimestampOrder] = useState<'asc' | 'desc'>('desc')
  const pageSize = 25
  const chainConfig = useChainConfig()

  useEffect(() => {
    setPage(1)
    setSearchQuery('')
    setSelectedAccounts([])
    setActiveAccounts([])
  }, [chainConfig.id])

  // Reset page when search query changes
  useEffect(() => {
    setPage(1)
  }, [debouncedSearchQuery])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 1000)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Filter by active accounts, or all selected accounts if none are active, or by current search query
  const searchFilter =
    activeAccounts.length > 0
      ? activeAccounts
      : selectedAccounts.length > 0
        ? selectedAccounts
        : debouncedSearchQuery
          ? [debouncedSearchQuery]
          : undefined

  const { data: liquidations, isLoading: isLiquidationsDataLoading } = useLiquidations(
    page,
    pageSize,
    searchFilter,
    timestampOrder,
  )
  const { data: assetsData, isLoading: isAssetsLoading } = useAssets()

  const maxEntries = liquidations?.total ?? 0
  const totalPages = Math.ceil(maxEntries / pageSize)

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleAddAccount = () => {
    if (searchQuery.trim() && !selectedAccounts.includes(searchQuery.trim())) {
      setSelectedAccounts((prev) => [...prev, searchQuery.trim()])
      setSearchQuery('')
      setPage(1)
    }
  }

  const handleRemoveAccount = (account: string) => {
    setSelectedAccounts((prev) => prev.filter((acc) => acc !== account))
    setActiveAccounts((prev) => prev.filter((acc) => acc !== account))
    setPage(1)
  }

  const handleToggleActiveAccount = (account: string) => {
    setActiveAccounts((prev) => {
      const isActive = prev.includes(account)

      if (isActive) {
        const updatedAccounts = prev.filter((acc) => acc !== account)
        return updatedAccounts
      } else {
        const updatedAccounts = [...prev, account]
        return updatedAccounts
      }
    })
    setPage(1)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleAddAccount()
    }
  }

  const isLoading = (!liquidations && isLiquidationsDataLoading) || (!assetsData && isAssetsLoading)

  const calculateUSD = (price: string | undefined, amount: string | number | BigNumber.Value) => {
    return price ? BN(price).multipliedBy(amount).shiftedBy(-PRICE_ORACLE_DECIMALS).toNumber() : 0
  }

  const titleComponent = (
    <div className='flex flex-col md:flex-row md:items-center md:justify-between w-full px-4 py-2 bg-surface-dark gap-3'>
      <Text className='font-semibold'>Recently Executed Liquidations</Text>
      <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full md:w-auto'>
        {selectedAccounts.length > 0 && (
          <div className='flex items-center gap-2 flex-wrap'>
            {selectedAccounts.map((account, index) => {
              const isActive = activeAccounts.includes(account)
              return (
                <div
                  key={index}
                  className={classNames(
                    'flex items-center gap-1 px-2 py-1.5 rounded-sm border text-xs cursor-pointer transition-colors',
                    isActive
                      ? 'border-white bg-white/10 text-white font-medium'
                      : 'border-white/30 bg-transparent text-white/60 hover:border-white/50',
                  )}
                  onClick={() => handleToggleActiveAccount(account)}
                >
                  <span>{account}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveAccount(account)
                    }}
                    className='w-2 h-2 text-white/40 hover:text-white/60 transition-colors'
                    type='button'
                  >
                    <Cross className='w-2 h-2' />
                  </button>
                </div>
              )
            })}
          </div>
        )}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onKeyDown={handleKeyPress}
          className='w-full sm:w-80'
          label='Search by account IDs...'
        />
      </div>
    </div>
  )

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    setSorting((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      const timestampEntry = next.find((item) => item.id === 'timestamp')

      if (timestampEntry) {
        setTimestampOrder(timestampEntry.desc ? 'desc' : 'asc')
        setPage(1)
      }

      return next
    })
  }

  const columns = useMemo<ColumnDef<LiquidationDataItem>[]>(() => {
    const baseColumns = [
      {
        id: 'timestamp',
        accessorKey: 'timestamp',
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
        id: 'collateral_asset_won',
        header: 'Liquidated Collateral',
        accessorKey: 'collateral_asset_won',
        sortingFn: (rowA: Row<LiquidationDataItem>, rowB: Row<LiquidationDataItem>) => {
          const aUSD = calculateUSD(
            rowA.original.price_liquidated,
            rowA.original.collateral_asset_won?.amount || 0,
          )
          const bUSD = calculateUSD(
            rowB.original.price_liquidated,
            rowB.original.collateral_asset_won?.amount || 0,
          )
          return aUSD - bUSD
        },
        cell: ({ row }: { row: Row<LiquidationDataItem> }) => (
          <LiquidatedAsset
            value={row.original.collateral_asset_won as BNCoin}
            assetData={assetsData}
            priceAtLiquidation={row.original.price_liquidated}
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
        id: 'protocol_fee_coin',
        accessorKey: 'protocol_fee_coin',
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
        sortingFn: (rowA: Row<LiquidationDataItem>, rowB: Row<LiquidationDataItem>) => {
          const aUSD = calculateUSD(
            rowA.original.price_protocol_fee_coin,
            rowA.original.protocol_fee_coin?.amount || 0,
          )
          const bUSD = calculateUSD(
            rowB.original.price_protocol_fee_coin,
            rowB.original.protocol_fee_coin?.amount || 0,
          )
          return aUSD - bUSD
        },
        cell: ({ row }: { row: Row<LiquidationDataItem> }) => (
          <div className='flex justify-end items-start gap-1'>
            <LiquidatedAsset
              value={row.original.protocol_fee_coin as BNCoin}
              assetData={assetsData}
              priceAtLiquidation={row.original.price_protocol_fee_coin}
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
          <Transaction txHash={row.original.tx_hash as string} />
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
    if (searchFilter) {
      return (
        <>
          <Table
            title={titleComponent}
            columns={columns}
            data={[]}
            tableBodyClassName='text-lg'
            initialSorting={sorting}
            onSortingChange={handleSortingChange}
          />
          <div className='flex flex-wrap justify-center w-full gap-4 py-8'>
            <Text className='w-full text-center' size='lg'>
              No liquidations found for account ID
              {Array.isArray(searchFilter) && searchFilter.length > 1 ? 's' : ''} &quot;
              {Array.isArray(searchFilter) ? searchFilter.join(', ') : searchFilter}&quot;
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
        initialSorting={sorting}
        onSortingChange={handleSortingChange}
      />

      {totalPages > 1 && (
        <Pagination currentPage={page} onPageChange={handlePageChange} totalPages={totalPages} />
      )}
    </>
  )
}
