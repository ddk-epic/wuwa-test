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
      // rules
      onTrigger: {
        conditions: ["isBuffTarget"],
        effects: ["createBuff"],
      },
      onEvent: {
        effects: ["applyBuffStatChanges"],
      },
      onExpire: {
        effects: ["removeBuffStatChanges"],
      },
    },
    {
      id: "Stellar Symphony (Concerto)",
      name: "Stellar Symphony (Concerto)",
      triggers: [{ category: "liberation" }],
      modifiers: [
        { class: "concerto", value: 8 },
        { class: "concerto", value: 10 },
        { class: "concerto", value: 12 },
        { class: "concerto", value: 14 },
        { class: "concerto", value: 16 },
      ],
      duration: 0,
      cooldown: 20,
      // rules
      onTrigger: {
        conditions: ["isBuffTarget", "isCategory", "isNotOnCooldown"],
        effects: ["createBuff"],
      },
      onEvent: {
        effects: ["applyDCondFlat"],
      },
    },
    {
      id: "Stellar Symphony",
      name: "Stellar Symphony",
      triggers: [{ category: "skill" }],
      target: { appliesTo: "all" },
      modifiers: [
        { class: "atk", value: 0.14 },
        { class: "atk", value: 0.175 },
        { class: "atk", value: 0.21 },
        { class: "atk", value: 0.245 },
        { class: "atk", value: 0.28 },
      ],
      duration: 30,
      // rules
      onTrigger: {
        conditions: ["isCategory", "isHealEvent"],
        effects: ["createBuff"],
      },
      onEvent: {
        effects: ["applyBuffStatChanges"],
      },
      onExpire: {
        effects: ["removeBuffStatChanges"],
      },
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
      // rules
      onTrigger: {
        conditions: ["isBuffTarget"],
        effects: ["createBuff"],
      },
      onEvent: {
        effects: ["applyBuffStatChanges"],
      },
      onExpire: {
        effects: ["removeBuffStatChanges"],
      },
    },
    {
      id: "Stringmaster (Atk)",
      name: "Stringmaster (Atk)",
      triggers: [{ category: "skill" }],
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
      // rules
      onTrigger: {
        conditions: ["isBuffTarget", "isCategory", "isDamageEvent"],
        effects: ["createBuff"],
      },
      onEvent: { effects: ["applyStackingBuffStatChanges"] },
      onExpire: { effects: ["removeStackingBuffStatChanges"] },
    },
    {
      id: "Stringmaster (Off-field)",
      name: "Stringmaster (Off-field)",
      triggers: [{ category: "skill" }],
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
      // rules
      dep: { "Stringmaster (Atk)": 1 },
      onTrigger: {
        conditions: ["isBuffTarget", "isCategory", "isOffField"],
        effects: ["createBuff"],
      },
      onEvent: { effects: ["addStacksToBuff", "applyStackingBuffStatChanges"] },
      onExpire: { effects: ["removeStackingBuffStatChanges"] },
    },
  ],
  Variation: [
    {
      id: "Variation",
      name: "Variation",
      triggers: [{ category: "skill" }],
      modifiers: [
        { class: "concerto", value: 8 },
        { class: "concerto", value: 10 },
        { class: "concerto", value: 12 },
        { class: "concerto", value: 14 },
        { class: "concerto", value: 16 },
      ],
      duration: 0,
      cooldown: 20,
      // rules
      onTrigger: {
        conditions: ["isBuffTarget", "isCategory", "isNotOnCooldown"],
        effects: ["createBuff"],
      },
      onEvent: { effects: ["applyDCondFlat"] },
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
      // rules
      onTrigger: { conditions: ["isBuffTarget"], effects: ["createBuff"] },
      onEvent: { effects: ["applyBuffStatChanges"] },
      onExpire: { effects: ["removeBuffStatChanges"] },
    },
    {
      id: "Blazing Brilliance (Skill)",
      name: "Blazing Brilliance (Skill)",
      triggers: [{ ability: "any" }],
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
      // rules
      dep: { skill: 5 },
      onTrigger: {
        conditions: ["isBuffTarget", "isNotOnCooldown", "isDamageEvent"],
        effects: ["createBuff"],
      },
      onEvent: {
        conditions: ["isNotOnCooldown", "isDamageEvent"],
        effects: ["addStacksToBuff", "applyStackingBuffStatChanges"],
      },
      onExpire: { effects: ["removeStackingBuffStatChanges"] },
    },
    // {
    //   id: "Blazing Brilliance (MAX)",
    //   name: "Blazing Brilliance (MAX)",
    //   triggers: [{ condition: "Blazing Brilliance (Skill) x14" }],
    //   duration: 12,
    //   // rules
    //   triggerRules: ["isBuffTarget", "hasConditionByName"],
    //   onTrigger: ["updateBuffIdentity"],
    //   onIndex: { 0: ["applyBuffStatChanges"] ,
    //   onExpire: ["removeStackingBuffStatChanges"],
    // },
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
      // rules
      onTrigger: { conditions: ["isBuffTarget"], effects: ["createBuff"] },
      onEvent: { effects: ["applyBuffStatChanges"] },
      onExpire: { effects: ["removeBuffStatChanges"] },
    },
    {
      id: "Emerald of Genesis (Atk)",
      name: "Emerald of Genesis (Atk)",
      triggers: [{ category: "skill" }],
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
      // rules
      onTrigger: {
        conditions: ["isBuffTarget", "isCategory"],
        effects: ["createBuff"],
      },
      onEvent: { effects: ["applyStackingBuffStatChanges"] },
      onExpire: { effects: ["removeStackingBuffStatChanges"] },
    },
  ],
}

export default weaponBuffData
