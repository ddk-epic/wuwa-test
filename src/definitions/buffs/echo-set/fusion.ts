import type { BuffDefinition } from "@/shared/types"

const fusionSets: Record<string, BuffDefinition[]> = {
  "Molten Rift": [
    {
      id: "Molten Rift 2pc",
      name: "Molten Rift 2pc",
      modifiers: [{ class: "fusion", value: 0.1 }],
      duration: 99999,
    },
    {
      id: "Molten Rift 5pc",
      name: "Molten Rift 5pc",
      trigger: { category: ["skill"] },
      modifiers: [{ class: "fusion", value: 0.3 }],
      duration: 15,
    },
  ],
}

export default fusionSets
