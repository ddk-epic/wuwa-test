import type { WEAPON_KEY, WeaponBuffDefinition } from "@/shared/types"

import swords from "./sword"
import rectifier from "./rectifier"

export const weaponBuffs: Record<WEAPON_KEY, WeaponBuffDefinition[]> = {
  "Blazing Brilliance": swords["Blazing Brilliance"],
  "Emerald of Genesis": swords["Emerald of Genesis"],
  "Stellar Symphony": rectifier["Stellar Symphony"],
  Stringmaster: rectifier["Stringmaster"],
}

export default weaponBuffs