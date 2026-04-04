import type { Echo } from "@/shared/types"

const fusionEchoes: Record<string, Echo> = {
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
      canc: {
        frames: 108,
      },
      swap: {
        frames: 62,
      },
    },
  },
}

export default fusionEchoes