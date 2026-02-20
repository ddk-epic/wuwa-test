import type { Echo } from "./types"

const echoes: Record<string, Echo> = {
  "Impermanence Heron": {
    name: "Impermanence Heron",
    damage: 3.1056,
    castTime: 1.5,
    cooldown: 20,
    set: "Moonlit Clouds",
    classifications: ["echo", "havoc"],
    hits: 1,
  },
  "Inferno Rider": {
    name: "Inferno Rider",
    damage: 8.08,
    castTime: 2.8,
    cooldown: 20,
    set: "Molten Rift",
    classifications: ["echo", "fusion"],
    hits: 1,
  },
}

export default echoes
