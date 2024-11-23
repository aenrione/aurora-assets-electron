import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const arrayFilter = (row:any, columnId:any, filterValue:any) => {
  const rowValue = row.getValue(columnId)
  if (Array.isArray(filterValue)) {
    return filterValue.includes(rowValue)
  }
  return rowValue.toString().toLowerCase().includes(filterValue.toLowerCase())
}
