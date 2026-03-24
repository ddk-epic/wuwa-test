import type { BuffMap, CATEGORY, DEEPEN_KEY, ELEMENT } from "./types"

export const totalBuffMap: BuffMap = {
  // base stats
  atk: 0,
  def: 0,
  hp: 0,
  er: 1,
  crit: 0.05,
  critDmg: 1.5,
  // category bonuses
  basic: 0,
  heavy: 0,
  skill: 0,
  liberation: 0,
  all: 0,
  // elemental bonuses
  aero: 0,
  electro: 0,
  fusion: 0,
  glacio: 0,
  havoc: 0,
  spectro: 0,
  // category deepen
  baDeep: 0,
  heDeep: 0,
  skDeep: 0,
  liDeep: 0,
  allDeep: 0,
  // elemental deepen
  aeDeep: 0,
  elDeep: 0,
  fuDeep: 0,
  glDeep: 0,
  haDeep: 0,
  spDeep: 0,
  // skill specific
  bonus: 0,
  amp: 0,
  multiplier: 0,
  // special
  resIgnore: 0,
  defIgnore: 0,
  erMulti: 0,
  foMulti: 0,
  heal: 0,
  allEle: 0,
  physical: 0,
  // dCond
  forte: 0,
  forte2: 0,
  concerto: 0,
  resonance: 0,
  intro: 0,
  outro: 0,
  echo: 0,
}

export const getSkillLevel = {
  1: 1.0,
  2: 1.082,
  3: 1.164,
  4: 1.2788,
  5: 1.3608,
  6: 1.4551,
  7: 1.5863,
  8: 1.7175,
  9: 1.8487,
  10: 1.9881,
} as const

export const bonusToDeepen: Record<CATEGORY | ELEMENT, DEEPEN_KEY> = {
  basic: "baDeep",
  heavy: "heDeep",
  liberation: "liDeep",
  skill: "skDeep",
  aero: "aeDeep",
  electro: "elDeep",
  fusion: "fuDeep",
  glacio: "glDeep",
  havoc: "haDeep",
  spectro: "spDeep",
}
