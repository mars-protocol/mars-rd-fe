import { flexRender, Row as TanstackRow, Table as TanstackTable } from '@tanstack/react-table'
import classNames from 'classnames'

import { LEFT_ALIGNED_ROWS } from 'constants/table'

interface Props<T> {
  row: TanstackRow<T>
  table: TanstackTable<T>
  renderExpanded?: (row: TanstackRow<T>, table: TanstackTable<T>) => React.ReactElement
  rowClassName?: string
  spacingClassName?: string
  className?: string
  isSelectable?: boolean
  type?: TableType
  onClick?: (id: string) => void
  isBalancesTable?: boolean
}

function getBorderColor(
  type: TableType,
  row: AccountBalanceRow | AccountStrategyRow | AccountPerpRow,
  isWhitelisted: boolean,
) {
  if (type === 'strategies') return ''
  if (type === 'balances') {
    if (!isWhitelisted) return 'border-grey-dark'
    const balancesRow = row as AccountBalanceRow
    return balancesRow.type === 'borrow' ? 'border-loss' : 'border-profit'
  }

  const perpRow = row as AccountPerpRow
  return perpRow.tradeDirection === 'short' ? 'border-loss' : 'border-profit'
}

// Type guards for row data
function hasName(row: unknown): row is { name: string } {
  return typeof row === 'object' && row !== null && 'name' in row
}

function hasIsWhitelisted(row: unknown): row is { isWhitelisted?: boolean } {
  return typeof row === 'object' && row !== null
}

function hasAssetDenom(row: unknown): row is { asset: { denom: string } } {
  return (
    typeof row === 'object' &&
    row !== null &&
    'asset' in row &&
    typeof row.asset === 'object' &&
    row.asset !== null &&
    'denom' in row.asset
  )
}

export default function Row<T>(props: Props<T>) {
  const { renderExpanded, table, row, type, spacingClassName, isSelectable, isBalancesTable } =
    props
  const canExpand = !!renderExpanded

  const name = hasName(row.original) ? row.original.name : ''
  const isWhitelisted =
    (hasIsWhitelisted(row.original) ? row.original.isWhitelisted !== false : true) &&
    !name.includes('Perps USDC Vault')

  return (
    <>
      <tr
        key={`${row.id}-row`}
        className={classNames(
          'transition-bg duration-100 border-white/10 border-b last:border-b-0',
          (renderExpanded || isSelectable || props.onClick) && 'hover:cursor-pointer',
          canExpand && row.getIsExpanded()
            ? 'is-expanded bg-surface-dark'
            : 'bg-surface hover:bg-surface-dark',
          'group/assetRow',
          !isWhitelisted && 'relative',
        )}
        onClick={(e) => {
          e.preventDefault()
          if (isSelectable) {
            row.toggleSelected()
          }
          if (canExpand) {
            const isExpanded = row.getIsExpanded()
            table.resetExpanded()
            !isExpanded && row.toggleExpanded()
          }

          if (props.onClick && hasAssetDenom(row.original)) {
            props.onClick(row.original.asset.denom)
          }
        }}
      >
        {row.getVisibleCells().map((cell) => {
          return (
            <td
              key={cell.id}
              className={classNames(
                LEFT_ALIGNED_ROWS.includes(cell.column.id) ? 'text-left' : 'text-right',
                spacingClassName ?? 'px-4 py-2.5',
                type &&
                  type !== 'strategies' &&
                  LEFT_ALIGNED_ROWS.includes(cell.column.id) &&
                  'border-l',
                type &&
                  type !== 'strategies' &&
                  getBorderColor(
                    type,
                    cell.row.original as AccountBalanceRow | AccountStrategyRow | AccountPerpRow,
                    isWhitelisted,
                  ),
                cell.column.columnDef.meta?.className,
                !isWhitelisted && isBalancesTable && 'opacity-60',
                !isWhitelisted && isBalancesTable && 'group-hover/assetRow:opacity-100',
              )}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          )
        })}
      </tr>
      {row.getIsExpanded() && renderExpanded && renderExpanded(row, table)}
    </>
  )
}
