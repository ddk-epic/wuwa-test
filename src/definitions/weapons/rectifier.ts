import type { Weapon } from "@/shared/types"

const rectifiers: Record<string, Weapon> = {
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
  // 4 star
  "Variation": {
    name: "Variation",
    type: "Rectifier",
    rank: 1,
    atk: 27,
    mainStat: "er",
    mainStatAmount: 0.1152,
  },
}

export default rectifiers
