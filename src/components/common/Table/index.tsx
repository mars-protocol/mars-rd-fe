import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  OnChangeFn,
  RowSelectionState,
  SortingState,
  Row as TanstackRow,
  Table as TanstackTable,
  useReactTable,
} from '@tanstack/react-table'
import classNames from 'classnames'
import React, { ReactElement } from 'react'

import Card from 'components/common/Card'
import { SortAsc, SortDesc, SortNone } from 'components/common/Icons'
import Row from 'components/common/Table/Row'
import Text from 'components/common/Text'
import { LEFT_ALIGNED_ROWS } from 'constants/table'
import ConditionalWrapper from 'hocs/ConditionalWrapper'
import Button from 'components/common/Button'

interface Props<T> {
  title: string | ReactElement
  columns: ColumnDef<T>[]
  data: T[]
  initialSorting: SortingState
  renderExpanded?: (row: TanstackRow<T>, table: TanstackTable<T>) => JSX.Element
  tableBodyClassName?: string
  spacingClassName?: string
  type?: TableType
  hideCard?: boolean
  setRowSelection?: OnChangeFn<RowSelectionState>
  selectedRows?: RowSelectionState
  paginationRows: {
    pageIndex: number
    pageSize: number
  }
  onClickRow?: (id: string) => void
}

export default function Table<T>(props: Props<T>) {
  const {
    title,
    columns,
    initialSorting,
    data,
    renderExpanded,
    tableBodyClassName,
    spacingClassName,
    type,
    hideCard,
    selectedRows,
    paginationRows,
    setRowSelection,
    onClickRow,
  } = props
  const [sorting, setSorting] = React.useState<SortingState>(initialSorting)
  const [pagination, setPagination] = React.useState(paginationRows)

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
      rowSelection: selectedRows,
    },
    // initialState: {
    //   pagination: {
    //     pageIndex: 0, //custom initial page index
    //     pageSize: 25, //custom default page size
    //   },
    // },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <ConditionalWrapper
      condition={!hideCard}
      wrapper={(children) => (
        <Card
          className={classNames('w-full', type !== 'balances' && 'h-fit')}
          contentClassName='max-w-full overflow-x-scroll scrollbar-hide'
          title={title}
        >
          {children}
        </Card>
      )}
    >
      <table className={classNames('w-full', props?.tableBodyClassName)}>
        <thead className='border-b bg-black/20 border-white/10'>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={classNames(
                      spacingClassName ?? 'px-4 py-3',
                      header.column.getCanSort() && 'hover:cursor-pointer',
                      LEFT_ALIGNED_ROWS.includes(header.id) ? 'text-left' : 'text-right',
                      header.column.columnDef.meta?.className,
                    )}
                  >
                    <div
                      className={classNames(
                        'flex',
                        LEFT_ALIGNED_ROWS.includes(header.id) ? 'justify-start' : 'justify-end',
                        'align-center relative',
                      )}
                    >
                      <Text
                        tag='span'
                        size='xs'
                        className='flex items-center font-normal text-white/60'
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </Text>
                      {header.column.getCanSort() && (
                        <span
                          className={classNames(
                            'w-5 h-5 my-auto text-white',
                            !LEFT_ALIGNED_ROWS.includes(header.id) &&
                              'absolute -mr-4.5 -translate-y-1/2 top-1/2',
                          )}
                        >
                          {header.column.getCanSort()
                            ? {
                                asc: <SortAsc size={16} />,
                                desc: <SortDesc />,
                                false: <SortNone />,
                              }[header.column.getIsSorted() as string] ?? null
                            : null}
                        </span>
                      )}
                    </div>
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <Row
              key={row.id}
              row={row}
              table={table}
              renderExpanded={renderExpanded}
              spacingClassName={spacingClassName}
              isSelectable={!!setRowSelection}
              type={type}
              onClick={onClickRow}
            />
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={1000} className='text-right'>
              <div className='flex justify-end items-center space-x-2'>
                <Button
                  variant='solid'
                  color='tertiary'
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  text={'Prev'}
                  size='sm'
                />
                <Button
                  variant='solid'
                  color='tertiary'
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  text={'Next'}
                  size='sm'
                />
              </div>
              <Text size='xs' className='mt-2'>
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </Text>
            </td>
          </tr>
        </tfoot>
      </table>
    </ConditionalWrapper>
  )
}
