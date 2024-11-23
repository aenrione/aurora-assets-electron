"use client"
import React from "react"
import { DataTableFacetedFilter } from "./filters"
import { Table } from "@tanstack/react-table"

interface FiltersProps<TData> {
  table: Table<TData>,
  onFilterChange?: (filter: string, value: any) => void
}

export const ToolbarFilters = <TData extends unknown>({ table, onFilterChange }: FiltersProps<TData>) => {
  return (
    <div className="space-x-2 space-y-2">
      {table.getAllColumns().map((column: any) => {
        if (column.columnDef?.noFilter) {
          return null
        }

        return (
          <DataTableFacetedFilter
            key={column.id}
            column={table.getColumn(column.id)}
            title={column.columnDef.meta?.label}
            options={column.columnDef.options || []}
            filterType={column.columnDef.filterType}
            onFilterChange={onFilterChange}
          />
        )
      })}
    </div>
  )
}
