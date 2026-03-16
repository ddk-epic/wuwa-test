import type { BuffObject } from "@/constants/types"

export const echoBuffs: Record<string, BuffObject[]> = {
  "Inferno Rider": [
    {
      id: "Inferno Rider (Fusion/Basic)",
      name: "Inferno Rider (Fusion/Basic)",
      type: "Buff",
      source: "Self",
      triggeredBy: ["Inferno Rider"],
      appliesTo: "Self",
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
      type: "Buff",
      source: "Self",
      triggeredBy: ["Impermanence Heron"],
      appliesTo: "Self",
      modifiers: [],
      consumedBy: ["outro"],
      duration: 15,
    },
    {
      id: "Impermanence Heron",
      name: "Impermanence Heron",
      type: "BuffNext",
      source: "Self",
      triggeredBy: ["outro"],
      appliesTo: "Next",
      modifiers: [],
      duration: 15,
    },
  ],
}
