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
  decimals = 3,
): T {
  const factor = 10 ** decimals

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      Math.round((value + Number.EPSILON) * factor) / factor,
    ]),
  ) as T
}

export function roundBuffMapToPercentStrings<T extends Record<string, number>>(
  obj: T,
  decimals = 1,
): Record<keyof T, string> {
  const factor = 10 ** decimals

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      const roundedValue =
        Math.round((value * 100 + Number.EPSILON) * factor) / factor
      return [key, `${roundedValue}%`]
    }),
  ) as Record<keyof T, string>
}

export function getBaseSkillName(name: string): string {
  const index = name.indexOf(" (")
  return index === -1 ? name : name.slice(0, index)
}