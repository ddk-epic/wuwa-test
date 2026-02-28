import type { Echo } from "./types"

const echoes: Record<string, Echo> = {
  "Impermanence Heron": {
    name: "Impermanence Heron",
    category: "Echo",
    classifications: ["havoc", "echo"],
    mv: 3.1056,
    frames: 90,
    cooldown: 20,
    set: "Moonlit Clouds",
    hits: 1,
    concerto: 0,
    resonance: 0,
  },
  "Inferno Rider": {
    name: "Inferno Rider",
    category: "Echo",
    classifications: ["fusion", "echo"],
    mv: 8.08,
    frames: 168,
    cooldown: 20,
    set: "Molten Rift",
    hits: 1,
    concerto: 0,
    resonance: 0,
  },
}

export default echoes
