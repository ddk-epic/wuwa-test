import type { Weapon } from "./types"

export const weaponData: Record<WEAPON_KEY, Weapon> = {
  "Emerald of Genesis": {
    name: "Emerald of Genesis",
    type: "Sword",
    rank: 1,
    atk: 47,
    mainStat: "crit",
    mainStatAmount: 0.054,
  },
  Stringmaster: {
    name: "Stringmaster",
    type: "Rectifier",
    rank: 1,
    atk: 40,
    mainStat: "crit",
    mainStatAmount: 0.08,
  },
  "Stellar Symphony": {
    name: "Stellar Symphony",
    type: "Rectifier",
    rank: 1,
    atk: 33,
    mainStat: "er",
    mainStatAmount: 0.1712,
  },
}

export const WEAPONS = [
  "Emerald of Genesis",
  "Stringmaster",
  "Stellar Symphony",
] as const
export type WEAPON_KEY = (typeof WEAPONS)[number]
export type WEAPON_STAT = "atk" | "def" | "hp" | "er" | "crit" | "critDmg"
