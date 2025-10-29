import { flexRender, Row as TanstackRow, Table as TanstackTable } from '@tanstack/react-table'
import classNames from 'classnames'

import { LEFT_ALIGNED_ROWS } from 'constants/table'

interface Props<T> {
  row: TanstackRow<T>
  table: TanstackTable<T>
  renderExpanded?: (row: TanstackRow<T>, table: TanstackTable<T>) => JSX.Element
  rowClassName?: string
  spacingClassName?: string
  className?: string
  isSelectable?: boolean
  type?: TableType
  onClick?: (id: string) => void
}

function isAccountBalanceRow(row: unknown): row is AccountBalanceRow {
  return (row as AccountBalanceRow).type !== undefined
}

function isAccountPerpRow(row: unknown): row is AccountPerpRow {
  return (row as AccountPerpRow).tradeDirection !== undefined
}

function getBorderColor(
  type: TableType,
  row: AccountBalanceRow | AccountStrategyRow | AccountPerpRow,
) {
  if (type === 'strategies') return ''
  if (type === 'balances' && isAccountBalanceRow(row)) {
    return row.type === 'borrow' ? 'border-loss' : 'border-profit'
  }

  if (isAccountPerpRow(row)) {
    return row.tradeDirection === 'short' ? 'border-loss' : 'border-profit'
  }

  return ''
}

export default function Row<T>(props: Props<T>) {
  const { renderExpanded, table, row, type, spacingClassName, isSelectable } = props
  const canExpand = !!renderExpanded

  return (
    <>
      <tr
        key={`${row.id}-row`}
        className={classNames(
          'transition-bg duration-100 border-white/10',
          (renderExpanded || isSelectable || props.onClick) && 'hover:cursor-pointer',
          canExpand && row.getIsExpanded()
            ? 'is-expanded border-t gradient-header'
            : 'hover:bg-white/5',
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

          if (
            props.onClick &&
            typeof row.original === 'object' &&
            row.original !== null &&
            'asset' in row.original &&
            typeof row.original.asset === 'object' &&
            row.original.asset !== null &&
            'denom' in row.original.asset
          ) {
            props.onClick(row.original.asset.denom as string)
          }
        }}
      >
        {row.getVisibleCells().map((cell) => {
          return (
            <td
              key={cell.id}
              className={classNames(
                'text-sm',
                LEFT_ALIGNED_ROWS.includes(cell.column.id) ? 'text-left' : 'text-right',
                spacingClassName ?? 'px-3 py-4',
                type &&
                  type !== 'strategies' &&
                  LEFT_ALIGNED_ROWS.includes(cell.column.id) &&
                  'border-l',
                type &&
                  type !== 'strategies' &&
                  getBorderColor(
                    type,
                    cell.row.original as AccountBalanceRow | AccountStrategyRow | AccountPerpRow,
                  ),
                cell.column.columnDef.meta?.className,
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
