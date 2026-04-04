import type { Character } from "@/shared/types"
import { weaponData } from "../weapons"

const shorekeeper: Character = {
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
    er: 0.46,
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
    glacio: 0,
    havoc: 0,
    spectro: 0.3,
  },
  dCond: {
    forte: 0,
    forte2: 0,
    concerto: 0,
    resonance: 150,
  },
}

export default shorekeeper