import type { Weapon, WEAPON_KEY, WeaponBuffDefinition } from "@/shared/types"

import weaponBuffs from "../weapons/buffs"
import weaponData from "../weapons/data"

export const wData: Record<WEAPON_KEY, Weapon> = {
  "Blazing Brilliance": weaponData["Blazing Brilliance"],
  "Emerald of Genesis": weaponData["Emerald of Genesis"],
  "Stellar Symphony": weaponData["Stellar Symphony"],
  Stringmaster: weaponData["Stringmaster"],
  Variation: weaponData["Variation"],
}

export const wBuffs: Record<WEAPON_KEY, WeaponBuffDefinition[]> = {
  "Blazing Brilliance": weaponBuffs["Blazing Brilliance"],
  "Emerald of Genesis": weaponBuffs["Emerald of Genesis"],
  "Stellar Symphony": weaponBuffs["Stellar Symphony"],
  Stringmaster: weaponBuffs["Stringmaster"],
  Variation: weaponBuffs["Variation"],
}
