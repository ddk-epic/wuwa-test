import type { BuffObject } from "@/constants/types"

export const setBuffs: Record<string, BuffObject[]> = {
  "Molten Rift": [
    {
      name: "Molten Rift 2pc",
      type: "Buff",
      source: "Self",
      appliesTo: "Self",
      modifiers: [{class: "fusion", value: 0.1}],
      duration: 99999,
    },
    {
      name: "Molten Rift 5pc",
      type: "Buff",
      source: "Self",
      triggeredBy: ["skill"],
      appliesTo: "Self",
      modifiers: [{class: "fusion", value: 0.3}],
      duration: 15,
    },
  ],
  "Moonlit Clouds": [
    {
      name: "Moonlit Clouds 2pc",
      type: "Buff",
      source: "Self",
      appliesTo: "Self",
      modifiers: [{class: "er", value: 0.1}],
      duration: 99999,
    },
    {
      name: "Moonlit Clouds 5pc",
      type: "BuffNext",
      source: "Self",
      triggeredBy: ["outro"],
      appliesTo: "Next",
      modifiers: [{class: "atk", value: 0.225}],
      duration: 15,
    },
  ],
}
