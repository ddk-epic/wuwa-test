import type { Weapon } from "./types"

const weapons: Record<string, Weapon> = {
  "Emerald of Genesis": {
    name: "Emerald of Genesis",
    rank: 1,
    attack: 47,
    mainStat: "Crit. Rate",
    mainStatAmount: 5.4,
  },
  "Stringmaster": {
    name: "Stringmaster",
    rank: 1,
    attack: 40,
    mainStat: "Crit. Rate",
    mainStatAmount: 0.8,
  },
}

export default weapons
