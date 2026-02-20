import type { BonusStats, Character } from "./types"

const bonusStats: BonusStats = {
  atkflat: 350,
  hpflat: 4560,
  defflat: 0,
  atk: 0.182,
  hp: 0,
  def: 0,
  er: 0.2,
  crit: 0.405,
  cdmg: 0.81,
  basic: 0,
  heavy: 0,
  skill: 0,
  liberation: 0,
  /* Element */
  aero: 0,
  electro: 0,
  fusion: 0,
  glacio: 0,
  havoc: 0,
  spectro: 0,
}

const team: Record<string, Character> = {
  Encore: {
    name: "Encore",
    sequence: 0,
    weapon: {
      name: "Stringmaster",
      rank: 1,
      attack: 40,
      mainStat: "Crit. Rate",
      mainStatAmount: 0.8,
    },
    echo: {
    name: "Inferno Rider",
    damage: 8.08,
    castTime: 2.8,
    cooldown: 20,
    set: "Molten Rift",
    classifications: ["echo", "fusion"],
    hits: 1,
  },
    echoSet: "Molten Rift",
    build: "43311 Ele/Ele",
    element: "fusion",
    maxForte: 100,
    maxForte2: 0,
    /* stats */
    attack: 34,
    defense: 102,
    health: 841 * 12.5,
    crit: 0.5 + 0.36 + 0.405,
    critDmg: 1.5 + 0.81 + 0.44,
    bonusStats,
    dCond: {
  Forte: 0,
  Forte2: 0,
  Concerto: 0,
  Resonance: 150,
}
  },
  Sanhua: {
    name: "Sanhua",
    sequence: 0,
    weapon: {
      name: "Emerald of Genesis",
      rank: 1,
      attack: 47,
      mainStat: "Crit. Rate",
      mainStatAmount: .54,
    },
    echo: {
    name: "Impermanence Heron",
    damage: 3.1056,
    castTime: 1.5,
    cooldown: 20,
    set: "Moonlit Clouds",
    classifications: ["echo", "havoc"],
    hits: 1,
  },
    echoSet: "Moonlit Clouds",
    build: "43311 Ele/Ele",
    element: "glacio",
    maxForte: 100,
    maxForte2: 0,
    /* stats */
    attack: 22,
    defense: 77,
    health: 805 * 12.5,
    crit: 0.5 + 0.243 + 0.405,
    critDmg: 1.5 + 0.81 + 0.44,
    bonusStats,
    dCond: {
  Forte: 0,
  Forte2: 0,
  Concerto: 0,
  Resonance: 150,
}
  },
}

export default team
