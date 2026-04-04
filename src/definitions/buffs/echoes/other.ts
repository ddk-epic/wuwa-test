import type { BuffDefinition } from "@/shared/types"

const otherEchoes: Record<string, BuffDefinition[]> = {
  "Impermanence Heron": [
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
      trigger: { category: ["outro"] },
      appliesTo: "next",
      modifiers: [],
      duration: 15,
    },
  ],
}

export default otherEchoes
