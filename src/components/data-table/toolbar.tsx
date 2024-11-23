"use client"
import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Cross2Icon } from "@radix-ui/react-icons"
import { DataTableFacetedFilter } from "./filters"
import { ToolbarFilters } from "./toolbar.filters"
import { DataTableViewOptions } from "./view"
import { Table } from "@tanstack/react-table"
import type { Options } from "./filters"
import { FilterType } from "./table"

export type Filter = {
  label: string
  value: string
  options: Options[],
  dataType: FilterType
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  filters?: Filter[],
  customToolbarButton?: React.ReactNode,
  onFilterChange?: (filter: string, value: any) => void
}

export const DataTableToolbar = <TData,>({
  table,
  filters,
  customToolbarButton,
  onFilterChange,
}: DataTableToolbarProps<TData>) => {
  const isFiltered = table.getState().globalFilter !== undefined && table.getState().globalFilter !== ""
  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-y-2">
        <div className="flex flex-wrap flex-1 items-center md:gap-2">
          <Input
            placeholder="Search"
            value={table.getState().globalFilter ?? ""}
            onChange={(event) =>
              table.setGlobalFilter(event.target.value)
            }
            className="h-8 w-100 lg:w-[250px] md:w-[150px]"
          />
          {
            filters?.map((filter, index) => {
              if(!table.getColumn(filter.value)) return null
              return (
                <DataTableFacetedFilter
                  key={index}
                  column={table.getColumn(filter.value)}
                  title={filter.label}
                  options={filter.options}
                  filterType={filter.dataType}
                  onFilterChange={onFilterChange}
                />
              )
            })
          }
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetGlobalFilter()}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <DataTableViewOptions table={table} />
          {customToolbarButton}
        </div>
      </div>
      <ToolbarFilters table={table} onFilterChange={onFilterChange}/>
    </>
  )
}
