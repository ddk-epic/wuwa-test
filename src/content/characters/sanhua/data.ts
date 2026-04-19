import type { Character } from "@/shared/types"
import { wData } from "@/content/registries/weapons"

const sanhuaData: Character = {
  id: "sanhua",
  name: "Sanhua",
  sequence: 0,
  weaponType: "Sword",
  weapon: wData["Blazing Brilliance"],
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
}

export default sanhuaData
