import type { BuffDefinition, ECHO_SET_KEY } from "@/shared/types"

import fusionSets from "./fusion"
import otherSets from "./other"

export const setBuffs: Record<ECHO_SET_KEY, BuffDefinition[]> = {
  "Molten Rift": fusionSets["Molten Rift"],
  "Moonlit Clouds": otherSets["Moonlit Clouds"],
  "Rejuvenating Glow": otherSets["Rejuvenating Glow"],
}

export default setBuffs
