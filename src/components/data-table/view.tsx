"use client"
import React from "react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { MixerHorizontalIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { RowData } from "@tanstack/react-table"
import { Table } from "@tanstack/react-table"

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    label: string
  }
}

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
}

export const DataTableViewOptions = <TData,>({
  table,
}: DataTableViewOptionsProps<TData>) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
        >
          <MixerHorizontalIcon className="mr-2 h-4 w-4" />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Select</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.columnDef.meta?.label || column.id}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
