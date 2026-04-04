import type { Character } from "@/shared/types"
import { weaponData } from "../weapons"

const encore: Character = {
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
  bonusStats: {
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
  },
  dCond: {
    forte: 0,
    forte2: 0,
    concerto: 0,
    resonance: 150,
  },
}

export default encore
