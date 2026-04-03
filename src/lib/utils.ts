import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import type { BUFF_TYPE } from "@/shared/types"
import { STAT_COLORS } from "@/definitions/colors"

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

export function frameToSecond(number: number, digits: number = 2): string {
  const seconds = number / 60

  if (seconds === 0) return "0"

  return seconds.toFixed(digits)
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

export function toPercent(value: number, decimals = 1): string {
  return (value * 100).toFixed(decimals) + "%"
}

export function getStatCellColor(statKey: BUFF_TYPE, value: number) {
  const { rgb, minValue, maxValue } = STAT_COLORS[statKey]
  const [r, g, b] = rgb.split(" ").map(Number)

  const baseFactor = 0.4

  const normalized = (value - minValue) / (maxValue - minValue)
  const intensity = Math.min(Math.max(normalized, 0), 1) // clamped

  const mix = (channel: number) =>
    Math.round(channel * (baseFactor + (1 - baseFactor) * intensity) + 20)

  return { backgroundColor: `rgb(${mix(r)} ${mix(g)} ${mix(b)})` }
}
