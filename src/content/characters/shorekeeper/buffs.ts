import type { BuffDefinition } from "@/shared/types"

const shorekeeperBuffs: BuffDefinition[] = [
  {
    id: "Self Gravitation",
    name: "Self Gravitation",
    duration: 30,
    triggers: [
      {
        condition: "Outer Stellarealm",
      },
    ],
    target: { source: "shorekeeper", appliesTo: "shorekeeper" },
    modifiers: [{ class: "er", value: 0.1 }],
    // rules
    onTrigger: {
      conditions: ["isBuffTarget", "hasConditionById"],
      effects: ["createBuff"],
    },
    onEvent: {
      effects: ["applyBuffStatChanges"],
    },
    onExpire: {
      effects: ["removeBuffStatChanges"],
    },
  },
  // {
  //   id: "Self Gravitation (rover)",
  //   name: "Self Gravitation (rover)",
  //   duration: 0,
  //   triggers: [
  //     {
  //       condition: "Outer Stellarealm",
  //     },
  //   ],
  //   target: { source: "shorekeeper", appliesTo: "rover" },
  //   modifiers: [{ class: "er", value: 0.1 }],
  //   // rules
  // },
  {
    id: "Binary Butterfly",
    name: "Binary Butterfly",
    duration: 30,
    triggers: [{ ability: "Binary Butterfly" }],
    target: { source: "shorekeeper", appliesTo: "all" },
    modifiers: [{ class: "allDeep", value: 0.15 }],
    // rules
    onTrigger: {
      conditions: ["isAbility"],
      effects: ["addToBuffNext"],
    },
    onSwap: {
      effects: ["createBuffNext"],
    },
    onEvent: {
      effects: ["applyBuffStatChanges"],
    },
    onExpire: {
      effects: ["removeBuffStatChanges"],
    },
  },
  {
    id: "Outer Stellarealm",
    name: "Outer Stellarealm",
    duration: 30,
    triggers: [{ ability: "End Loop" }],
    target: { source: "shorekeeper", appliesTo: "all" },
    modifiers: [
      {
        class: "heal",
        frame: 180,
        value: 0.0239,
        flat: 438,
        type: "heal",
      },
      {
        class: "heal",
        frame: 360,
        value: 0.0239,
        flat: 438,
        type: "heal",
      },
      {
        class: "heal",
        frame: 540,
        value: 0.0239,
        flat: 438,
        type: "heal",
      },
      {
        class: "heal",
        frame: 720,
        value: 0.0239,
        flat: 438,
        type: "heal",
      },
      {
        class: "heal",
        frame: 900,
        value: 0.0239,
        flat: 438,
        type: "heal",
      },
      {
        class: "heal",
        frame: 1080,
        value: 0.0239,
        flat: 438,
        type: "heal",
      },
      {
        class: "heal",
        frame: 1260,
        value: 0.0239,
        flat: 438,
        type: "heal",
      },
      {
        class: "heal",
        frame: 1440,
        value: 0.0239,
        flat: 438,
        type: "heal",
      },
      {
        class: "heal",
        frame: 1620,
        value: 0.0239,
        flat: 438,
        type: "heal",
      },
      {
        class: "heal",
        frame: 1800,
        value: 0.0239,
        flat: 438,
        type: "heal",
      },
    ],
    // rules
    onTrigger: {
      conditions: ["isAbility"],
      effects: ["createBuff", "createHealProcEvent"],
    },
  },
  {
    id: "Inner Stellarealm",
    name: "Inner Stellarealm",
    duration: 30,
    triggers: [{ category: "intro", condition: "Outer Stellarealm" }],
    target: { source: "shorekeeper", appliesTo: "all" },
    modifiers: [
      { class: "crit", statReq: "er", stepValue: 0.002, value: 0.0001 },
    ],
    stackLimit: 1250,
    stackInterval: 0,
    // rules
    onTrigger: {
      conditions: ["isCategory", "hasConditionById"],
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
    id: "Supernal Stellarealm",
    name: "Supernal Stellarealm",
    duration: 30,
    triggers: [{ category: "intro", condition: "Inner Stellarealm" }],
    target: { source: "shorekeeper", appliesTo: "all" },
    modifiers: [
      { class: "critDmg", statReq: "er", stepValue: 0.001, value: 0.0001 },
    ],
    stackLimit: 2500,
    stackInterval: 0,
    // rules
    onTrigger: {
      conditions: ["isCategory", "hasConditionById"],
      effects: ["createBuff"],
    },
    onEvent: {
      effects: ["applyBuffStatChanges"],
    },
    onExpire: {
      effects: ["removeBuffStatChanges"],
    },
  },
]

export default shorekeeperBuffs
