import type { Echo } from "@/shared/types"

const otherEchoes: Record<string, Echo> = {
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
}

export default otherEchoes
