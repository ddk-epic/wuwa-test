import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

declare global {
  interface String {
    capitalize(): string
  }
}

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1)
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function frameToSecond(number: number, digits: number) {
  return Number(number / 60).toFixed(digits)
}
