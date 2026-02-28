import type { BuffObject } from "@/constants/types"

export const echoBuffs: Record<string, BuffObject[]> = {
  "Inferno Rider": [
    {
      name: "Inferno Rider (Fusion/Basic)",
      type: "Buff",
      owner: "Self",
      createdBy: ["Self"],
      triggeredBy: ["Inferno Rider"],
      appliesTo: "Self",
      modifier: ["fusion", "basic"],
      value: 0.12,
      duration: 15,
    },
  ],
  "Impermanence Heron": [
    {
      name: "Impermanence Heron (Energy)",
      type: "BuffEnergy",
      owner: "Self",
      createdBy: ["Self"],
      triggeredBy: ["Impermanence Heron"],
      appliesTo: "Self",
      modifier: ["resonance"],
      value: 0.12,
      duration: 15,
    },
    {
      name: "Impermanence Heron (Dormant)",
      type: "Buff",
      owner: "Self",
      createdBy: ["Self"],
      triggeredBy: ["Impermanence Heron"],
      appliesTo: "Self",
      modifier: ["none"],
      consumedBy: ["Silversnow"],
      value: 0,
      duration: 15,
    },
    {
      name: "Impermanence Heron",
      type: "BuffNext",
      owner: "Self",
      createdBy: ["Self"],
      triggeredBy: ["outro"],
      appliesTo: "Next",
      modifier: ["none"],
      value: 0,
      duration: 15,
    },
  ],
}
