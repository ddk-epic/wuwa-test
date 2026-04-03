import type { ELEMENT, BUFF_TYPE } from "@/shared/types"

export const ELEMENT_COLORS: Record<
  ELEMENT | "default",
  { text: string; bg: string; border: string; state: string }
> = {
  aero: {
    text: "text-emerald-400",
    bg: "bg-emerald-500",
    border: "border-emerald-500",
    state: "data-[state=on]:bg-emerald-400/80",
  },
  electro: {
    text: "text-violet-500",
    bg: "bg-violet-600",
    border: "border-violet-600",
    state: "data-[state=on]:bg-violet-500/80",
  },
  fusion: {
    text: "text-red-500",
    bg: "bg-red-600",
    border: "border-red-600",
    state: "data-[state=on]:bg-red-500/80",
  },
  glacio: {
    text: "text-cyan-300",
    bg: "bg-cyan-400",
    border: "border-cyan-400",
    state: "data-[state=on]:bg-cyan-300/80",
  },
  havoc: {
    text: "text-rose-600",
    bg: "bg-rose-700",
    border: "border-rose-700",
    state: "data-[state=on]:bg-rose-600/80",
  },
  spectro: {
    text: "text-yellow-300",
    bg: "bg-yellow-400",
    border: "border-yellow-400",
    state: "data-[state=on]:bg-yellow-300/80",
  },
  default: {
    text: "text-white",
    bg: "bg-white",
    border: "border-white",
    state: "data-[state=on]:bg-white/80",
  },
} as const

export const STAT_COLORS: Record<
  BUFF_TYPE,
  { rgb: string; minValue: number; maxValue: number; label: string }
> = {
  // stats (6)
  atk: { rgb: "59 130 246", minValue: 0, maxValue: 1.5, label: "atk" },
  def: { rgb: "59 130 246", minValue: 0, maxValue: 1, label: "def" },
  hp: { rgb: "59 130 246", minValue: 0, maxValue: 1, label: "hp" },
  er: { rgb: "59 130 246", minValue: 1, maxValue: 1.5, label: "er" },
  crit: { rgb: "59 130 246", minValue: 0.5, maxValue: 1, label: "crit" },
  critDmg: { rgb: "59 130 246", minValue: 2, maxValue: 3.5, label: "cDmg" },
  // category bonuses (5)
  basic: { rgb: "118 118 118", minValue: 0, maxValue: 1.5, label: "basic" },
  heavy: { rgb: "118 118 118", minValue: 0, maxValue: 1.5, label: "heavy" },
  skill: { rgb: "118 118 118", minValue: 0, maxValue: 1.5, label: "skill" },
  liberation: {
    rgb: "118 118 118",
    minValue: 0,
    maxValue: 1.5,
    label: "liber",
  },
  all: { rgb: "118 118 118", minValue: 0, maxValue: 1.5, label: "all" },
  // elemental bonuses (6)
  aero: { rgb: "16 185 129", minValue: 0, maxValue: 1.5, label: "aero" },
  electro: { rgb: "139 92 246", minValue: 0, maxValue: 1.5, label: "electro" },
  fusion: { rgb: "239 68 68", minValue: 0, maxValue: 1.5, label: "fusion" },
  glacio: { rgb: "14 165 233", minValue: 0, maxValue: 1.5, label: "glacio" },
  havoc: { rgb: "190 18 60", minValue: 0, maxValue: 1.5, label: "havoc" },
  spectro: { rgb: "253 224 71", minValue: 0, maxValue: 1.5, label: "spectro" },
  // category deepen (5)
  baDeep: { rgb: "118 118 118", minValue: 0, maxValue: 0.2, label: "basic" },
  heDeep: { rgb: "118 118 118", minValue: 0, maxValue: 0.2, label: "heavy" },
  skDeep: { rgb: "118 118 118", minValue: 0, maxValue: 0.2, label: "skill" },
  liDeep: { rgb: "118 118 118", minValue: 0, maxValue: 0.2, label: "liber" },
  allDeep: { rgb: "118 118 118", minValue: 0, maxValue: 0.2, label: "all" },
  // elemental deepen (6)
  aeDeep: { rgb: "16 185 129", minValue: 0, maxValue: 0.2, label: "aero" },
  elDeep: { rgb: "139 92 246", minValue: 0, maxValue: 0.2, label: "electro" },
  fuDeep: { rgb: "249 115 22", minValue: 0, maxValue: 0.2, label: "fusion" },
  glDeep: { rgb: "14 165 233", minValue: 0, maxValue: 0.2, label: "glacio" },
  haDeep: { rgb: "190 18 60", minValue: 0, maxValue: 0.2, label: "havoc" },
  spDeep: { rgb: "253 224 71", minValue: 0, maxValue: 0.2, label: "spectro" },
  // skill specific (3)
  bonus: { rgb: "6 182 212", minValue: 0, maxValue: 0.2, label: "bonus" },
  amp: { rgb: "6 182 212", minValue: 0, maxValue: 0.2, label: "amp" },
  multiplier: { rgb: "6 182 212", minValue: 0, maxValue: 0.2, label: "multi" },
  // special (2)
  resIgnore: { rgb: "118 118 118", minValue: 0, maxValue: 0.2, label: "-res" },
  defIgnore: { rgb: "118 118 118", minValue: 0, maxValue: 0.2, label: "-def" },
  // --------------------------------------------------
  erMulti: { rgb: "1 1 1", minValue: 0, maxValue: 1, label: "er%" },
  foMulti: { rgb: "1 1 1", minValue: 0, maxValue: 1, label: "forte%" },
  heal: { rgb: "1 1 1", minValue: 0, maxValue: 1, label: "heal%" },
  allEle: { rgb: "1 1 1", minValue: 0, maxValue: 1, label: "allEle" },
  physical: { rgb: "1 1 1", minValue: 0, maxValue: 1, label: "physical" },
  // dCond
  forte: { rgb: "1 1 1", minValue: 0, maxValue: 1, label: "forte" },
  forte2: { rgb: "1 1 1", minValue: 0, maxValue: 1, label: "forte2" },
  concerto: { rgb: "1 1 1", minValue: 0, maxValue: 1, label: "concerto" },
  resonance: { rgb: "1 1 1", minValue: 0, maxValue: 1, label: "resonance" },
  intro: { rgb: "1 1 1", minValue: 0, maxValue: 1, label: "intro" },
  outro: { rgb: "1 1 1", minValue: 0, maxValue: 1, label: "outro" },
  echo: { rgb: "1 1 1", minValue: 0, maxValue: 1, label: "echo" },
}
