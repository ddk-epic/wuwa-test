import type { BuffDefinition } from "@/shared/types"

const fusionEchoes: Record<string, BuffDefinition[]> = {
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
}

export default fusionEchoes