import type { WeaponBuffDefinition } from "@/shared/types"

const weaponBuffData: Record<string, WeaponBuffDefinition[]> = {
  /* Rectifiers */
  "Stellar Symphony": [
    {
      id: "Stellar Symphony (Hp)",
      name: "Stellar Symphony (Hp)",
      modifiers: [
        { class: "hp", value: 0.12 },
        { class: "hp", value: 0.15 },
        { class: "hp", value: 0.18 },
        { class: "hp", value: 0.21 },
        { class: "hp", value: 0.24 },
      ],
      duration: 99999,
    },
    {
      id: "Stellar Symphony (Concerto)",
      name: "Stellar Symphony (Concerto)",
      trigger: { category: ["liberation"] },
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
    {
      id: "Stellar Symphony",
      name: "Stellar Symphony",
      trigger: { category: ["skill"] },
      appliesTo: "all",
      modifiers: [
        { class: "atk", value: 0.14 },
        { class: "atk", value: 0.175 },
        { class: "atk", value: 0.21 },
        { class: "atk", value: 0.245 },
        { class: "atk", value: 0.28 },
      ],
      duration: 30,
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
  /* Swords */
  "Blazing Brilliance": [
    {
      id: "Blazing Brilliance (Atk)",
      name: "Blazing Brilliance (Atk)",
      modifiers: [
        { class: "atk", value: 0.12 },
        { class: "atk", value: 0.15 },
        { class: "atk", value: 0.18 },
        { class: "atk", value: 0.21 },
        { class: "atk", value: 0.24 },
      ],
      duration: 99999,
    },
    {
      id: "Blazing Brilliance (Skill)",
      name: "Blazing Brilliance (Skill)",
      trigger: { ability: ["any"] },
      modifiers: [
        { class: "skill", value: 0.04 },
        { class: "skill", value: 0.05 },
        { class: "skill", value: 0.06 },
        { class: "skill", value: 0.07 },
        { class: "skill", value: 0.08 },
      ],
      stackLimit: 14,
      stackInterval: 0.5,
      duration: 999,
    },
    {
      id: "Blazing Brilliance (MAX)",
      name: "Blazing Brilliance (MAX)",
      trigger: { condition: ["Blazing Brilliance (Skill) x14"] },
      duration: 12,
    },
  ],
  "Emerald of Genesis": [
    {
      id: "Emerald of Genesis (ER)",
      name: "Emerald of Genesis (ER)",
      modifiers: [
        { class: "er", value: 0.128 },
        { class: "er", value: 0.16 },
        { class: "er", value: 0.192 },
        { class: "er", value: 0.224 },
        { class: "er", value: 0.256 },
      ],
      duration: 99999,
    },
    {
      id: "Emerald of Genesis (Atk)",
      name: "Emerald of Genesis (Atk)",
      trigger: { category: ["skill"] },
      modifiers: [
        { class: "skill", value: 0.06 },
        { class: "skill", value: 0.075 },
        { class: "skill", value: 0.09 },
        { class: "skill", value: 0.105 },
        { class: "skill", value: 0.12 },
      ],
      stackLimit: 2,
      stackInterval: 0,
      duration: 10,
    },
  ],
}

export default weaponBuffData
