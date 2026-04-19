import type { Weapon } from "@/shared/types"

const weaponData: Record<string, Weapon> = {
  /* Rectifiers */
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
  "Variation": {
    name: "Variation",
    type: "Rectifier",
    rank: 1,
    atk: 27,
    mainStat: "er",
    mainStatAmount: 0.1152,
  },
  /* Swords */
    "Blazing Brilliance": {
    name: "Blazing Brilliance",
    type: "Sword",
    rank: 1,
    atk: 47,
    mainStat: "critDmg",
    mainStatAmount: 0.108,
  },
  "Emerald of Genesis": {
    name: "Emerald of Genesis",
    type: "Sword",
    rank: 1,
    atk: 47,
    mainStat: "crit",
    mainStatAmount: 0.054,
  },
}

export default weaponData
