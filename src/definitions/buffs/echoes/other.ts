import type { BuffDefinition } from "@/shared/types"

const otherEchoes: Record<string, BuffDefinition[]> = {
  "Impermanence Heron": [
    {
      id: "Impermanence Heron (energy)",
      name: "Impermanence Heron (energy)",
      trigger: { ability: ["Impermanence Heron"] },
      modifiers: [{ class: "er", value: 10 }],
      duration: 0,
    },
    {
      id: "Impermanence Heron (Dormant)",
      name: "Impermanence Heron (Dormant)",
      trigger: { ability: ["Impermanence Heron"] },
      modifiers: [],
      duration: 15,
    },
    {
      id: "Impermanence Heron",
      name: "Impermanence Heron",
      trigger: {
        category: ["outro"],
        condition: ["Impermanence Heron (Dormant)"],
      },
      modifiers: [{ class: "all", value: 0.12 }],
      duration: 15,
    },
  ],
}

export default otherEchoes
