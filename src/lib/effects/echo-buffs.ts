import type { BuffObject } from "@/constants/types"

export const echoBuffs: Record<string, BuffObject[]> = {
  "Inferno Rider": [
    {
      id: "Inferno Rider (Fusion/Basic)",
      name: "Inferno Rider (Fusion/Basic)",
      type: "Buff",
      source: "self",
      triggeredBy: {skill: ["Inferno Rider"]},
      appliesTo: "self",
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
      source: "self",
      triggeredBy: {skill: ["Impermanence Heron"]},
      appliesTo: "self",
      modifiers: [],
      consumedBy: ["outro"],
      duration: 15,
    },
    {
      id: "Impermanence Heron",
      name: "Impermanence Heron",
      type: "BuffNext",
      source: "self",
      triggeredBy: {category: ["outro"]},
      appliesTo: "next",
      modifiers: [],
      duration: 15,
    },
  ],
}
