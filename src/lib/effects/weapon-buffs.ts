import type { WeaponBuffObject } from "@/constants/types"

export const weaponBuffs: Record<string, WeaponBuffObject[]> = {
  Stringmaster: [
    {
      name: "Electric Amplification (Ele)",
      type: "Buff",
      createdBy: ["Stringmaster"],
      appliesTo: "Self",
      modifier: ["allEle"],
      value: [0.12, 0.15, 0.18, 0.21, 0.24],
      duration: 99999,
    },
    {
      name: "Electric Amplification (ATK)",
      type: "BuffStacking",
      createdBy: ["Stringmaster"],
      triggeredBy: ["skill"],
      appliesTo: "Self",
      modifier: ["atk"],
      stackLimit: 2,
      stackInterval: 0.5,
      value: [0.12, 0.15, 0.18, 0.21, 0.24],
      duration: 5,
    },
    {
      name: "Electric Amplification (Off-field)",
      type: "BuffStacking",
      createdBy: ["Stringmaster"],
      triggeredBy: ["skill"],
      appliesTo: "Self",
      modifier: ["atk"],
      stackLimit: 2,
      stackInterval: 0,
      value: [0.12, 0.15, 0.18, 0.21, 0.24],
      duration: 99999,
    },
  ],
}
