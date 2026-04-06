import type { WeaponBuffDefinition } from "@/shared/types"

const rectifier: Record<string, WeaponBuffDefinition[]> = {
  "Stellar Symphony": [
    {
      id: "Stellar Symphony",
      name: "Stellar Symphony",
      modifiers: [
        { class: "allEle", value: 0.12 },
        { class: "allEle", value: 0.15 },
        { class: "allEle", value: 0.18 },
        { class: "allEle", value: 0.21 },
        { class: "allEle", value: 0.24 },
      ],
      duration: 99999,
    },
  ],
  Stringmaster: [
    {
      id: "Stringmaster (Ele)",
      name: "Stringmaster (Ele)",
      modifiers: [
        { class: "allEle", value: 0.12 },
        { class: "allEle", value: 0.15 },
        { class: "allEle", value: 0.18 },
        { class: "allEle", value: 0.21 },
        { class: "allEle", value: 0.24 },
      ],
      duration: 99999,
    },
    {
      id: "Stringmaster (ATK)",
      name: "Stringmaster (ATK)",
      trigger: { category: ["skill"] },
      modifiers: [
        { class: "atk", value: 0.12 },
        { class: "atk", value: 0.15 },
        { class: "atk", value: 0.18 },
        { class: "atk", value: 0.21 },
        { class: "atk", value: 0.24 },
      ],
      stackLimit: 2,
      stackInterval: 0.5,
      duration: 5,
    },
    {
      id: "Stringmaster (Off-field)",
      name: "Stringmaster (Off-field)",
      trigger: { category: ["skill"] },
      modifiers: [
        { class: "atk", value: 0.12 },
        { class: "atk", value: 0.15 },
        { class: "atk", value: 0.18 },
        { class: "atk", value: 0.21 },
        { class: "atk", value: 0.24 },
      ],
      stackLimit: 2,
      stackInterval: 0,
      duration: 0.5,
    },
  ],
}

export default rectifier