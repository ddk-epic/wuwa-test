import type { Element } from "./types"

export const ELEMENT_COLORS: Record<
  (Element | "default"),
  { text: string; bg: string; border: string, state: string }
> = {
  aero: {
    text: "text-emerald-400",
    bg: "bg-emerald-500",
    border: "border-emerald-500",
    state: "data-[state=on]:bg-emerald-500/80"
  },
  electro: {
    text: "text-violet-500",
    bg: "bg-violet-600",
    border: "border-violet-600",
    state: "data-[state=on]:bg-violet-600/80"
  },
  fusion: {
    text: "text-red-500",
    bg: "bg-red-600",
    border: "border-red-600",
    state: "data-[state=on]:bg-red-600/80"
  },
  glacio: {
    text: "text-cyan-300",
    bg: "bg-cyan-400",
    border: "border-cyan-400",
    state: "data-[state=on]:bg-cyan-400/80"
  },
  havoc: {
    text: "text-rose-600",
    bg: "bg-rose-700",
    border: "border-rose-700",
    state: "data-[state=on]:bg-rose-700/80"
  },
  spectro: {
    text: "text-yellow-300",
    bg: "bg-yellow-400",
    border: "border-yellow-400",
    state: "data-[state=on]:bg-yellow-400/80"
  },
  default: {
    text: "text-white",
    bg: "bg-white",
    border: "border-white",
    state: "data-[state=on]:bg-white/80"
  },
}
