import type { Weapon } from "./types"

export const weaponData: Record<string, Weapon> = {
  "Emerald of Genesis": {
    name: "Emerald of Genesis",
    type: "Sword",
    rank: 1,
    atk: 47,
    mainStat: "Crit. Rate",
    mainStatAmount: 0.054,
  },
  Stringmaster: {
    name: "Stringmaster",
    type: "Rectifier",
    rank: 1,
    atk: 40,
    mainStat: "Crit. Rate",
    mainStatAmount: 0.08,
  },
  "Stellar Symphony": {
    name: "Stellar Symphony",
    type: "Rectifier",
    rank: 1,
    atk: 33,
    mainStat: "Crit. Rate",
    mainStatAmount: 0.1712,
  },
}

export const WEAPONS = Object.keys(weaponData)
