"use client"
import React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Spinner } from "@/components/ui/spinner"
import { DataTablePagination } from "./pagination"
import { arrayFilter } from "@/lib/utils"
import { DataTableToolbar } from "./toolbar"
import { useState, useEffect } from "react"
import type { Options } from "./filters"

export type FilterType = "text" | "select" | "multiselect" | "date" | "range" | "custom"
export type Pagination = {
  pageIndex: number,
  pageSize: number,
}

export type ColumnDefWithFilter<TData, TValue> = ColumnDef<TData, TValue> & {
  id?: string,
  accessorKey?: string,
  options?: Options[],
  hidden?: boolean,
  filterType?: FilterType,
  noFilter?: boolean,
}
const defaultColumnDef: Omit<ColumnDefWithFilter<any, any>, "accessorKey" | "cell" | "header"> = {
  filterType: "multiselect",
  noFilter: false,
  hidden: false,
  filterFn: arrayFilter,
}

export function createColumnDef<TData, TValue>(
  columnDef: ColumnDefWithFilter<TData, TValue>
): ColumnDefWithFilter<TData, TValue> {
  return {
    ...defaultColumnDef,
    ...columnDef,
  }
}


interface DataTableProps<TData, TValue> {
  columns: ColumnDefWithFilter<TData, TValue>[],
  data: TData[],
  canExport?: boolean,
  exportFileName?: string,
  customToolbarButton?: React.ReactNode,
  pageSize?: number,
  onPaginationChange?: (pagination: Pagination) => void,
  onPageSizeChange?: (pagination: Pagination) => void,
  currentPage?: number,
  totalPages?: number,
  loading?: boolean,
  onFilterChange?: (filter: string, value: any) => void,
}

export function DataTable<TData, TValue>({
  columns,
  data,
  canExport,
  exportFileName = "data.csv",
  customToolbarButton,
  pageSize = 10,
  onPageSizeChange,
  onPaginationChange,
  totalPages = 1,
  loading,
  onFilterChange,
}: DataTableProps<TData, TValue>) {

  const initialVisibility = columns.reduce((visibility, column) => {
    const key = (column.accessorKey || column.id) as string
    if (!key) {
      return visibility
    }

    return {
      ...visibility,
      [key]: !column?.hidden,
    }
  }, {})

  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialVisibility)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageSize,
  })

  useEffect(() => {
    if (onPaginationChange) {
      onPaginationChange(pagination)
    }
  }, [pagination.pageIndex, onPaginationChange])

  useEffect(() => {
    if (onPageSizeChange) {
      onPageSizeChange(pagination)
    }
  }, [pagination.pageSize, onPageSizeChange])

  const table = useReactTable({
    data,
    columns: columns.map(createColumnDef),
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination
    },
    onPaginationChange: setPagination,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    pageCount: totalPages,
    manualPagination: totalPages > 1
  })

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} canExport={canExport} exportFileName={exportFileName} customToolbarButton={customToolbarButton}
        onFilterChange={onFilterChange}
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {loading ? ( <Spinner className="ml-2" /> ) : "No results."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
