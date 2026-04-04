import type { WeaponBuffDefinition } from "@/shared/types"

const swords: Record<string, WeaponBuffDefinition[]> = {
  "Blazing Brilliance": [
    {
      id: "Blazing Brilliance (ATK)",
      name: "Blazing Brilliance (ATK)",
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
      trigger: { type: "hit", ability: ["any"] },
      modifiers: [
        { class: "skill", value: 0.04 },
        { class: "skill", value: 0.05 },
        { class: "skill", value: 0.06 },
        { class: "skill", value: 0.07 },
        { class: "skill", value: 0.08 },
      ],
      stackLimit: 14,
      stackInterval: 0.5,
      duration: 10,
    },
    {
      id: "Blazing Brilliance (MAX)",
      name: "Blazing Brilliance (MAX)",
      trigger: { condition: ["Blazing Brilliance (Skill) x14"] },
      modifiers: [
        { class: "skill", value: 0.04 * 14 },
        { class: "skill", value: 0.05 * 14 },
        { class: "skill", value: 0.06 * 14 },
        { class: "skill", value: 0.07 * 14 },
        { class: "skill", value: 0.08 * 14 },
      ],
      duration: 10,
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
      id: "Emerald of Genesis (ATK)",
      name: "Emerald of Genesis (ATK)",
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

export default swords