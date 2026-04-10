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
      id: "Stringmaster (Atk)",
      name: "Stringmaster (Atk)",
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
  Variation: [
    {
      id: "Variation",
      name: "Variation",
      trigger: { category: ["skill"] },
      modifiers: [
        { class: "concerto", value: 8 },
        { class: "concerto", value: 10 },
        { class: "concerto", value: 12 },
        { class: "concerto", value: 14 },
        { class: "concerto", value: 16 },
      ],
      duration: 0,
      cooldown: 20,
    },
  ],
}

export default rectifier
