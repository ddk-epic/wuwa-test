import type { BuffDefinition, ECHO_KEY } from "@/shared/types"

import fusionEchoes from "./fusion"
import otherEchoes from "./other"

export const echoBuffs: Record<ECHO_KEY, BuffDefinition[]> = {
  "Inferno Rider": fusionEchoes["Inferno Rider"],
  "Impermanence Heron": otherEchoes["Impermanence Heron"],
}

export default echoBuffs