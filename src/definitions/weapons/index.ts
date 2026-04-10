import type { Weapon, WEAPON_KEY } from "@/shared/types"
import swords from "./sword"
import rectifiers from "./rectifier"

export const weaponData: Record<WEAPON_KEY, Weapon> = {
  "Blazing Brilliance": swords["Blazing Brilliance"],
  "Emerald of Genesis": swords["Emerald of Genesis"],
  Stringmaster: rectifiers["Stringmaster"],
  "Stellar Symphony": rectifiers["Stellar Symphony"],
  Variation: rectifiers["Variation"],
}

export default weaponData