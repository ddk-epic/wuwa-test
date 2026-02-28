import type { BuffObject } from "@/constants/types"

export const setBuffs: Record<string, BuffObject[]> = {
  "Molten Rift": [
    {
      name: "Molten Rift 2pc",
      type: "Buff",
      owner: "Self",
      createdBy: ["Self"],
      appliesTo: "Self",
      modifier: ["fusion"],
      value: 0.1,
      duration: 99999,
    },
    {
      name: "Molten Rift 5pc",
      type: "Buff",
      owner: "Self",
      createdBy: ["Self"],
      triggeredBy: ["skill"],
      appliesTo: "Self",
      modifier: ["fusion"],
      value: 0.3,
      duration: 15,
    },
  ],
  "Moonlit Clouds": [
    {
      name: "Moonlit Clouds 2pc",
      type: "Buff",
      owner: "Self",
      createdBy: ["Self"],
      appliesTo: "Self",
      modifier: ["er"],
      value: 0.1,
      duration: 99999,
    },
    {
      name: "Moonlit Clouds 5pc",
      type: "BuffNext",
      owner: "Self",
      createdBy: ["Self"],
      triggeredBy: ["outro"],
      appliesTo: "Next",
      modifier: ["atk"],
      value: 0.225,
      duration: 15,
    },
  ],
}
