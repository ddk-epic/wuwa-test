import type { Weapon } from "@/shared/types"

const swords: Record<string, Weapon> = {
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

export default swords