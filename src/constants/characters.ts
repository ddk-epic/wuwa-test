import type { BonusStats, Character } from "./types"

const bonusStats: BonusStats = {
  "Flat Attack": 0,
  "Flat Health": 0,
  "Flat Defense": 0,
  Attack: 0.182,
  Health: 0,
  Defense: 0,
  "Energy Regen": 0.2,
  Crit: 0.405,
  "Crit Dmg": 0.81,
  Basic: 0,
  Heavy: 0,
  Skill: 0,
  Liberation: 0,
  /* Element */
  Aero: 0,
  Electro: 0,
  Fusion: 0,
  Glacio: 0,
  Havoc: 0,
  Spectro: 0,
}

const team: Record<string, Character> = {
  Sanhua: {
    name: "Sanhua",
    sequence: 0,
    weapon: "Emerald of Genesis",
    weaponRank: 1,
    echo: "Impermanence Heron",
    echoSet: "Moonlit Clouds",
    build: "43311 Ele/Ele",
    element: "glacio",
    maxForte: 100,
    maxForte2: 0,
    /* stats */
    attack: (22 * 12.5 + 587) * (1 + 0.36) + 350,
    defense: 77 * 12.5,
    health: 805 * 12.5 + 4560,
    crit: 0.5 + 0.243 + 0.405,
    critDmg: 1.50 + 0.81 + 0.44,
    bonusStats,
    dCond: new Map([
      ["Forte", 0],
      ["Forte2", 0],
      ["Concerto", 0],
      ["Resonance", 150],
    ]),
  },
}

export default team
