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

export function toPercent(value: number, decimals = 1): string {
  return (value * 100).toFixed(decimals) + "%"
}

export function getStatCellColor(statKey: BUFF_TYPE, value: number) {
  if (!STAT_COLORS[statKey]) return

  const { rgb, minValue, maxValue } = STAT_COLORS[statKey]

  const [r, g, b] = rgb.split(" ").map(Number)

  if (value === 0)
    return {
      backgroundColor: `rgba(${r}, ${g}, ${b}, 0.15)`,
    }

  const baseAlpha = 0.25 // minimum visibility
  const maxAlpha = 0.7

  const normalized = (value - minValue) / (maxValue - minValue)
  const intensity = Math.min(Math.max(normalized, 0), 1)

  const alpha = Math.min(maxAlpha, baseAlpha + (1 - baseAlpha) * intensity)

  return {
    backgroundColor: `rgba(${r}, ${g}, ${b}, ${alpha})`,
  }
}
