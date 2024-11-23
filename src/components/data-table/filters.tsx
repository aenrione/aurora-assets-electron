import React from "react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  // CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Column } from "@tanstack/react-table"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { FilterType } from "./table"
import { useState } from "react"

export type Options = {
  label: string;
  value: string;
  icon?: LucideIcon;
};

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options?: Options[];
  filterType?: FilterType;
  onFilterChange?: (filter: string, value: any) => void;
}

export const DataTableFacetedFilter = <TData, TValue>({
  column,
  title,
  options = [],
  filterType,
  onFilterChange,
}: DataTableFacetedFilterProps<TData, TValue>) => {
  const [freeText, setFreeText] = useState<string>("")
  const isSelect = filterType === "select" || filterType === "multiselect"

  const getColumnOptions = ():Options[] => {
    if (!column) {
      return []
    }

    if (options.length > 0) {
      return options
    }

    return column.getFacetedUniqueValues()
      ? Array.from(column.getFacetedUniqueValues().entries()).map(([value]) => {
        return { label: value, value }
      })
      : []
  }

  const facets = column?.getFacetedUniqueValues()
  let selectedValues: Set<string> | undefined

  if (filterType !== "date") {
    selectedValues = new Set(column?.getFilterValue() as string[])
  }


  const handleSelect = (value: string) => {
    if (!selectedValues) {
      return
    }

    if (selectedValues.has(value)) {
      selectedValues.delete(value)
    } else {
      selectedValues.add(value)
    }
    const filterValues = Array.from(selectedValues)
    column?.setFilterValue(filterValues.length ? filterValues : undefined)
    if (onFilterChange) {
      onFilterChange(column?.id as string, filterValues)
    }
  }

  const handleFreeTextChange = (text: string) => {
    setFreeText(text)
    column?.setFilterValue(text || undefined)
    if (onFilterChange) {
      onFilterChange(column?.id as string, text)
    }
  }

  const MultiSelectCommand = ({ options }: {options: Options[]}) => (
    <>
      <CommandEmpty>no results.</CommandEmpty>
      <CommandGroup>
        {options.map((option) => {
          if (!selectedValues) {
            return null
          }
          const isSelected = selectedValues.has(option.value)
          return (
            <CommandItem
              key={option.value}
              onSelect={() => handleSelect(option.value)}
            >
              <div
                className={cn(
                  "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-secondary-2",
                  isSelected
                    ? "bg-secondary-2 text-contrast-3"
                    : "opacity-50 [&_svg]:invisible"
                )}
              >
                <CheckIcon className={cn("h-4 w-4")} />
              </div>
              {option.icon && (
                <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
              )}
              <span>{option.label}</span>
              {facets?.get(option.value) && (
                <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                  {facets.get(option.value)}
                </span>
              )}
            </CommandItem>
          )
        })}
      </CommandGroup>
    </>
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className={`h-8 border-dashed`}>
          <PlusCircledIcon className="h-4 w-4 mr-1" />
          {title} {filterType === "text" && freeText != "" && `(${freeText})`}
          {(isSelect) && selectedValues && selectedValues?.size > 0 && options.length > 0 && (
            <>
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-100 p-0" align="start">
        <Command>
          <CommandInput
            placeholder={title}
            value={filterType === "text" ? freeText : undefined}
            onValueChange={(text: string) =>
              filterType === "text" ? handleFreeTextChange(text) : undefined
            }
          />
          <CommandList>
            {(isSelect) ? (
              <MultiSelectCommand options={getColumnOptions()} />
            ) : null}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
