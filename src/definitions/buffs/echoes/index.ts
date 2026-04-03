import type { BuffDefinition } from "@/shared/types"

export const echoBuffs: Record<string, BuffDefinition[]> = {
  "Inferno Rider": [
    {
      id: "Inferno Rider (Fusion/Basic)",
      name: "Inferno Rider (Fusion/Basic)",
      trigger: { ability: ["Inferno Rider"] },
      modifiers: [
        { class: "fusion", value: 0.12 },
        { class: "basic", value: 0.12 },
      ],
      duration: 15,
    },
  ],
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
