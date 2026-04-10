import type { WEAPON_KEY, WeaponBuffDefinition } from "@/shared/types"

import sword from "./sword"
import rectifier from "./rectifier"

export const weaponBuffs: Record<WEAPON_KEY, WeaponBuffDefinition[]> = {
  "Blazing Brilliance": sword["Blazing Brilliance"],
  "Emerald of Genesis": sword["Emerald of Genesis"],
  "Stellar Symphony": rectifier["Stellar Symphony"],
  Stringmaster: rectifier["Stringmaster"],
  Variation: rectifier["Variation"],
}

export default weaponBuffs