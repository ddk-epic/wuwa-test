import type { BuffDefinition } from "@/shared/types"

export const setBuffs: Record<string, BuffDefinition[]> = {
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
