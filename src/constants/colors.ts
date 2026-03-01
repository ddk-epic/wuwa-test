import type { Element } from "./types"

export const ELEMENT_COLORS: Record<
  Element,
  { text: string; bg: string; border: string }
> = {
  aero: {
    text: "text-emerald-400",
    bg: "bg-emerald-500",
    border: "border-emerald-500",
  },
  electro: {
    text: "text-violet-500",
    bg: "bg-violet-600",
    border: "border-violet-600",
  },
  fusion: {
    text: "text-red-500",
    bg: "bg-red-600",
    border: "border-red-600",
  },
  glacio: {
    text: "text-cyan-300",
    bg: "bg-cyan-400",
    border: "border-cyan-400",
  },
  havoc: {
    text: "text-rose-600",
    bg: "bg-rose-700",
    border: "border-rose-700",
  },
  spectro: {
    text: "text-yellow-300",
    bg: "bg-yellow-400",
    border: "border-yellow-400",
  },
}
