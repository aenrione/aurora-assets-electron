"use client"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/ui/popover"
import { Calendar } from "@repo/ui/components/ui/calendar"
import { Button } from "@repo/ui/components/ui/button"
import { CalendarIcon } from "@radix-ui/react-icons"
import { DateRange } from "react-day-picker"
import { cn } from "@repo/ui/lib/utils"
import { format } from "date-fns"
import { type FC } from "react"

interface CalendarDateRangePickerProps {
  date?: Date
  setDate?: (date?: Date) => void
}

export const CalendarDateRangePicker: FC<CalendarDateRangePickerProps> = ({ date, setDate }) => (
  <Popover modal={true}>
    <PopoverTrigger asChild>
      <Button
        id="date"
        variant={"outline"}
        className={cn(
          "justify-start text-left font-normal",
          !date && "text-muted-foreground"
        )}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {date ? format(date, "LLL dd, y") : <span>Elige una fecha</span>}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0" align="end">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        initialFocus
      />
    </PopoverContent>
  </Popover>
)