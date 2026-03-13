import type { Echo } from "./types"

export const echoData: Record<string, Echo> = {
  "Impermanence Heron": {
    name: "Impermanence Heron",
    category: "echo",
    classifications: ["havoc", "echo"],
    mv: [3.1056],
    frames: 90,
    cooldown: 20,
    set: "Moonlit Clouds",
    hits: [60],
    concerto: 0,
    resonance: 0,
    variations: {
      swap: {
        frames: 15,
      },
    },
  },
  "Inferno Rider": {
    name: "Inferno Rider",
    category: "echo",
    classifications: ["fusion", "echo"],
    mv: [2.424, 2.828, 2.828],
    frames: 168,
    cooldown: 20,
    set: "Molten Rift",
    hits: [30, 60, 90],
    concerto: 0,
    resonance: 0,
    variations: {
      cancel: {
        frames: 108,
      },
      swap: {
        frames: 62,
      },
    },
  },
}

export const ECHO = ["Impermanence Heron", "Inferno Rider"] as const
export const ECHO_SET = ["Molten Rift", "Moonlit Clouds"] as const
export type ECHO_KEY = (typeof ECHO)[number]
export type ECHO_SET_KEY = (typeof ECHO_SET)[number]
