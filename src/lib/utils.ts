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

export function roundBuffMap<T extends Record<string, number>>(
  obj: T,
  decimals = 3
): T {
  const factor = 10 ** decimals;

  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [
      k,
      Math.round((v + Number.EPSILON) * factor) / factor,
    ])
  ) as T;
}