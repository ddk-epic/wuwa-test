import type { BuffDefinition } from "@/shared/types"

const echoBuffs: Record<string, BuffDefinition[]> = {
  /* Fusion */
  "Inferno Rider": [
    {
      id: "Inferno Rider (Fusion/Basic)",
      name: "Inferno Rider (Fusion/Basic)",
      trigger: [{ ability: "Inferno Rider", index: 3 }],
      modifiers: [
        { class: "fusion", value: 0.12 },
        { class: "basic", value: 0.12 },
      ],
      duration: 15,
    },
  ],
  /* Other */
  "Fallacy of No Return": [
    {
      id: "Fallacy of No Return (Energy)",
      name: "Fallacy of No Return (Energy)",
      trigger: [{ ability: "Fallacy of No Return" }],
      modifiers: [{ class: "er", value: 0.1 }],
      duration: 20,
    },
    {
      id: "Fallacy of No Return",
      name: "Fallacy of No Return",
      trigger: [{ ability: "Fallacy of No Return" }],
      appliesTo: "all",
      modifiers: [{ class: "atk", value: 0.1 }],
      duration: 20,
    },
  ],
  "Impermanence Heron": [
    {
      id: "Impermanence Heron (Energy)",
      name: "Impermanence Heron (Energy)",
      trigger: [{ ability: "Impermanence Heron" }],
      modifiers: [{ class: "er", value: 10 }],
      duration: 0,
    },
    {
      id: "Impermanence Heron",
      name: "Impermanence Heron",
      trigger: [{ ability: "Impermanence Heron" }],
      modifiers: [],
      duration: 15,
    },
    {
      id: "Impermanence Heron (Buff)",
      name: "Impermanence Heron (Buff)",
      trigger: [
        {
          category: "outro",
          condition: "Impermanence Heron",
        },
      ],
      modifiers: [{ class: "all", value: 0.12 }],
      duration: 15,
    },
  ],
}

export default echoBuffs
