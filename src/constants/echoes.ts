import type { Echo } from "./types"

export const echoData: Record<string, Echo> = {
  "Impermanence Heron": {
    id: "Impermanence Heron",
    name: "Impermanence Heron",
    category: "echo",
    classifications: ["havoc", "echo"],
    set: "Moonlit Clouds",
    frames: 90,
    cooldown: 20,
    hits: [{ frame: 60, mv: 3.1056, resonance: 10 + 4.85 }],
    variations: {
      swap: {
        frames: 15,
      },
    },
  },
  "Inferno Rider": {
    id: "Inferno Rider",
    name: "Inferno Rider",
    category: "echo",
    classifications: ["fusion", "echo"],
    set: "Molten Rift",
    frames: 168,
    cooldown: 20,
    hits: [
      { frame: 30, mv: 2.424, resonance: 3.78 },
      { frame: 60, mv: 2.828, resonance: 4.41 },
      { frame: 90, mv: 2.828, resonance: 4.41 },
    ],
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
