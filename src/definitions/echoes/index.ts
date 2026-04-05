import type { Echo } from "@/shared/types"
import fusionEchoes from "./fusion"
import otherEchoes from "./other"

export const echoData: Record<string, Echo> = {
  "Inferno Rider": fusionEchoes["Inferno Rider"],
  "Impermanence Heron": otherEchoes["Impermanence Heron"],
}

export default echoData