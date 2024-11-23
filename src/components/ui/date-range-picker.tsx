"use client"
import { Calendar } from "@repo/ui/components/ui/calendar"
import { DateRange } from "react-day-picker"
import { type FC } from "react"

interface CalendarDateRangePickerProps {
  date?: DateRange
  setDate?: (date?: DateRange) => void
}

export const CalendarDateRangePicker: FC<CalendarDateRangePickerProps> = ({ date, setDate }) => (
  <>
    <Calendar
      initialFocus
      mode="range"
      defaultMonth={date?.from}
      selected={date}
      onSelect={setDate}
      numberOfMonths={2}
    />
  </>
)
