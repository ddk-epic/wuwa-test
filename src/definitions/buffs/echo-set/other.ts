import type { BuffDefinition } from "@/shared/types"

const otherSets: Record<string, BuffDefinition[]> = {
  "Moonlit Clouds": [
    {
      id: "Moonlit Clouds 2pc",
      name: "Moonlit Clouds 2pc",
      modifiers: [{ class: "er", value: 0.1 }],
      duration: 99999,
    },
    {
      id: "Moonlit Clouds 5pc",
      name: "Moonlit Clouds 5pc",
      trigger: { category: ["outro"] },
      appliesTo: "next",
      modifiers: [{ class: "atk", value: 0.225 }],
      duration: 15,
    },
  ],
}

export default otherSets