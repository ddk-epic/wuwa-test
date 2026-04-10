import type { Echo } from "@/shared/types"

const otherEchoes: Record<string, Echo> = {
    "Fallacy of No Return": {
    id: "Fallacy of No Return",
    name: "Fallacy of No Return",
    category: "echo",
    classifications: ["spectro", "echo"],
    set: "Rejuvenating Glow",
    frames: 1,
    cooldown: 20,
    hits: [{ frame: 120, mv: 0.1586, resonance: 3.04, scaling: "hp"}],
  },
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
