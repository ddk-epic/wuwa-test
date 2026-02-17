import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function frameToSecond(number: number, digits: number) {
  return Number(number / 60).toFixed(digits)
}
