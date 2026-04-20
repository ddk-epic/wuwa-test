import type {
  BuffDefinition,
  Echo,
  ECHO_KEY,
  ECHO_SET_KEY,
} from "@/shared/types"

import echoBuffs from "../content/echoes/buffs"
import echoData from "../content/echoes/data"
import setBuffs from "../content/echoes/set-buffs"

export const eAbilities: Record<ECHO_KEY, Echo> = {
  "Inferno Rider": echoData["Inferno Rider"],
  "Fallacy of No Return": echoData["Fallacy of No Return"],
  "Impermanence Heron": echoData["Impermanence Heron"],
}

export const eBuffs: Record<ECHO_KEY, BuffDefinition[]> = {
  "Inferno Rider": echoBuffs["Inferno Rider"],
  "Fallacy of No Return": echoBuffs["Fallacy of No Return"],
  "Impermanence Heron": echoBuffs["Impermanence Heron"],
}

export const sBuffs: Record<ECHO_SET_KEY, BuffDefinition[]> = {
  "Molten Rift": setBuffs["Molten Rift"],
  "Moonlit Clouds": setBuffs["Moonlit Clouds"],
  "Rejuvenating Glow": setBuffs["Rejuvenating Glow"],
}
