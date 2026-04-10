import type { Echo, ECHO_KEY } from "@/shared/types"
import fusionEchoes from "./fusion"
import otherEchoes from "./other"

export const echoData: Record<ECHO_KEY, Echo> = {
  "Inferno Rider": fusionEchoes["Inferno Rider"],
  "Impermanence Heron": otherEchoes["Impermanence Heron"],
  "Fallacy of No Return": otherEchoes["Fallacy of No Return"],
}

export default echoData