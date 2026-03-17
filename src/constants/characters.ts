import type { BonusStats, Character } from "./types"
import { weaponData } from "./weapons"

// Encore echo stat bonuses - 43311 critDmg/Ele/Ele
const bonusStats: BonusStats = {
  atkFlat: 350,
  hpFlat: 4560,
  defFlat: 0,
  atk: 0.36 + 0.172,
  hp: 0,
  def: 0,
  er: 0.2,
  crit: 0.405,
  critDmg: 0.81 + 0.44,
  basic: 0.172,
  heavy: 0,
  skill: 0,
  liberation: 0,
  /* Element */
  aero: 0,
  electro: 0,
  fusion: 0.6,
  glacio: 0,
  havoc: 0,
  spectro: 0,
}

const characterTemplate: Record<
  Exclude<CHARACTER_KEY, "__none__">,
  Character
> = {
  encore: {
    id: "encore",
    name: "Encore",
    sequence: 0,
    weaponType: "Rectifier",
    weapon: weaponData["Stringmaster"],
    echo: "Inferno Rider",
    echoSet: ["Molten Rift"],
    build: "43311 Ele/Ele",
    element: "fusion",
    bonus1: "atk",
    bonus2: "fusion",
    maxForte: 100,
    maxForte2: 0,
    /* stats */
    atk: 34,
    def: 102,
    hp: 841,
    crit: 0.05,
    critDmg: 1.5,
    bonusStats,
    dCond: {
      forte: 0,
      forte2: 0,
      concerto: 0,
      resonance: 150,
    },
  },
  sanhua: {
    id: "sanhua",
    name: "Sanhua",
    sequence: 0,
    weaponType: "Sword",
    weapon: weaponData["Blazing Brilliance"],
    echo: "Impermanence Heron",
    echoSet: ["Moonlit Clouds"],
    build: "43311 Ele/Ele",
    element: "glacio",
    bonus1: "atk",
    bonus2: "glacio",
    maxForte: 100,
    maxForte2: 0,
    /* stats */
    atk: 22,
    def: 77,
    hp: 805,
    crit: 0.05,
    critDmg: 1.5,
    bonusStats: {
      atkFlat: 350,
      hpFlat: 4560,
      defFlat: 0,
      atk: 0.36 + 0.172,
      hp: 0,
      def: 0,
      er: 0,
      crit: 0.405 + 0.22,
      critDmg: 0.81,
      basic: 0,
      heavy: 0,
      skill: 0.172,
      liberation: 0,
      /* Element */
      aero: 0,
      electro: 0,
      fusion: 0,
      glacio: 0.6,
      havoc: 0,
      spectro: 0,
    },
    dCond: {
      forte: 0,
      forte2: 0,
      concerto: 0,
      resonance: 150,
    },
  },
  shorekeeper: {
    id: "shorekeeper",
    name: "Shorekeeper",
    sequence: 0,
    weaponType: "Rectifier",
    weapon: weaponData["Stellar Symphony"],
    echo: "Impermanence Heron",
    echoSet: ["Moonlit Clouds"],
    build: "43311 Ele/Ele",
    element: "spectro",
    bonus1: "hp",
    bonus2: "heal",
    maxForte: 5,
    maxForte2: 0,
    /* stats */
    atk: 23,
    def: 90,
    hp: 1337,
    crit: 0.05,
    critDmg: 1.5,
    bonusStats: {
      atkFlat: 350,
      hpFlat: 4560,
      defFlat: 0,
      atk: 0,
      hp: 0.172,
      def: 0,
      er: 0.46 + 0.77,
      crit: 0,
      critDmg: 0.81,
      basic: 0,
      heavy: 0,
      skill: 0,
      liberation: 0.172,
      /* Element */
      aero: 0,
      electro: 0,
      fusion: 0,
      glacio: 0.6,
      havoc: 0,
      spectro: 0,
    },
    dCond: {
      forte: 0,
      forte2: 0,
      concerto: 0,
      resonance: 150,
    },
  },
}

export const CHARACTERS = ["encore", "sanhua", "shorekeeper"] as const
export type CHARACTER_KEY = (typeof CHARACTERS)[number]

export const CHARACTER_SELECTION = ["__none__", ...CHARACTERS] as const
export type CHARACTER_SELECTION_KEY = (typeof CHARACTER_SELECTION)[number]

export const BONUSSTAT_KEYS = [
  "atkFlat",
  "hpFlat",
  "defFlat",
  "atk",
  "hp",
  "def",
  "er",
  "crit",
  "critDmg",
  "basic",
  "heavy",
  "skill",
  "liberation",
  "aero",
  "electro",
  "fusion",
  "glacio",
  "havoc",
  "spectro",
] as const
export type BONUSSTAT_KEY = (typeof BONUSSTAT_KEYS)[number]

export default characterTemplate
