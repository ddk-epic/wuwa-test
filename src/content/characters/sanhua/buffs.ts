import type { BuffDefinition } from "@/shared/types"

const sanhuaBuffs: BuffDefinition[] = [
  {
    id: "Condensation",
    name: "Condensation",
    duration: 8,
    triggers: [{ category: "intro" }],
    target: { source: "sanhua", appliesTo: "sanhua" },
    modifiers: [{ class: "skill", value: 0.2 }],
    // rules

    onTrigger: {
      conditions: ["isBuffTarget", "isCategory"],
      effects: ["createBuff"],
    },
    onEvent: { effects: ["applyBuffStatChanges"] },
    onExpire: { effects: ["removeBuffStatChanges"] },
  },
  {
    id: "Avalanche",
    name: "Avalanche",
    duration: 8,
    triggers: [{ ability: "Frigid Light 5" }],
    target: { source: "sanhua", appliesTo: "sanhua" },
    modifiers: [],
    // rules

    onTrigger: {
      conditions: ["isBuffTarget", "isAbility"],
      effects: ["createBuff"],
    },
  },
  {
    id: "Avalanche (bonus)",
    name: "Avalanche (bonus)",
    duration: 0.5,
    triggers: [
      {
        ability: "Detonate",
        condition: "Avalanche",
      },
    ],
    target: { source: "sanhua", appliesTo: "sanhua" },
    modifiers: [{ class: "bonus", value: 0.2 }],
    // rules

    onTrigger: {
      conditions: [
        "isBuffTarget",
        "isAbility",
        "hasConditionById",
        "isDamageEvent",
      ],
      effects: ["createBuff"],
    },
    onEvent: { effects: ["applyBuffStatChanges"] },
    onExpire: { effects: ["removeBuffStatChanges"] },
  },
  {
    id: "Silversnow",
    name: "Silversnow",
    duration: 14,
    triggers: [{ ability: "Silversnow" }],
    target: { source: "sanhua" },
    modifiers: [{ class: "baDeep", value: 0.38 }],
    // rules

    onTrigger: { conditions: ["isAbility"], effects: ["addToBuffNext"] },
    onSwap: { effects: ["createBuffNext"] },
    onEvent: { effects: ["applyBuffStatChanges"] },
    onExpire: {
      conditions: ["hasSwapped"],
      effects: ["removeBuffStatChanges"],
    },
  },
  {
    id: "Ice Prism",
    name: "Ice Prism",
    duration: 5,
    classifications: ["glacio", "skill"],
    triggers: [{ ability: "Eternal Frost" }],
    target: { source: "sanhua", appliesTo: "sanhua" },
    modifiers: [{ class: "glacio", value: 0.4, concerto: 15, resonance: 7 }],
    // rules
    onTrigger: {
      conditions: ["isBuffTarget", "isAbility", "isDamageEvent"],
      effects: ["createBuff", "addToBuffDeferred"],
    },
  },
  {
    id: "Ice Thorn",
    name: "Ice Thorn",
    duration: 8,
    classifications: ["glacio", "skill"],
    triggers: [{ ability: "Freezing Thorns" }],
    target: { source: "sanhua", appliesTo: "sanhua" },
    modifiers: [{ class: "glacio", value: 0.3, resonance: 2 }],
    // rules
    onTrigger: {
      conditions: ["isBuffTarget", "isAbility", "isDamageEvent"],
      effects: ["createBuff", "addToBuffDeferred"],
    },
  },
  {
    id: "Ice Glacier",
    name: "Ice Glacier",
    duration: 5,
    classifications: ["glacio", "skill"],
    triggers: [{ ability: "Glacial Gaze" }],
    target: { source: "sanhua", appliesTo: "sanhua" },
    modifiers: [{ class: "glacio", value: 0.7, concerto: 15, resonance: 7 }],
    // rules
    onTrigger: {
      conditions: ["isBuffTarget", "isAbility", "isDamageEvent"],
      effects: ["createBuff", "addToBuffDeferred"],
    },
    onEvent: { effects: ["applyBuffStatChanges"] },
    onExpire: { effects: ["removeBuffStatChanges"] },
  },
  {
    id: "Detonate",
    name: "Detonate",
    duration: 0,
    classifications: ["glacio", "skill"],
    triggers: [{ ability: "Detonate" }],
    target: { source: "sanhua", appliesTo: "sanhua" },
    // rules
    dep: {
      "Ice Prism": 3, // 0011 stack & consume
      "Ice Thorn": 1, // 0001 stack
      "Ice Glacier": 3, // 0011 stack & consume
    },
    onTrigger: {
      conditions: ["isBuffTarget", "isAbility", "isDamageEvent"],
      effects: ["createBuff"],
    },
    onEvent: {
      effects: ["addDependencyStacksToBuff", "createDamageProcEvent"],
    },
  },
  {
    id: "Solitude's Embrace",
    name: "Solitude's Embrace",
    duration: 10,
    triggers: [{ ability: "Frigid Light 5" }],
    target: { source: "sanhua", appliesTo: "sanhua" },
    modifiers: [{ class: "crit", value: 0.15 }],
    sequenceReq: 1,
    // rules
    onTrigger: {
      conditions: ["isBuffTarget", "isAbility", "isDamageEvent"],
      effects: ["createBuff"],
    },
    onEvent: { effects: ["applyBuffStatChanges"] },
    onExpire: { effects: ["removeBuffStatChanges"] },
  },
  // {
  //   id: "Anomalous Vision",
  //   name: "Anomalous Vision",
  //   triggers: [],
  //   target: { source: "sanhua", appliesTo: "sanhua" },
  //   modifiers: [{ class: "all", value: 0.35 }],
  //   sequenceReq: 3,
  //   duration: 10,
  //   // rules
  //   conditions:{[],
  // },
  {
    id: "Blade Mastery",
    name: "Blade Mastery",
    duration: 5,
    triggers: [{ ability: "Glacial Gaze" }],
    target: { source: "sanhua", appliesTo: "sanhua" },
    modifiers: [],
    sequenceReq: 4,
    // rules
    onTrigger: {
      conditions: ["isBuffTarget", "isAbility"],
      effects: ["createBuff"],
    },
  },
  {
    id: "Blade Mastery (energy)",
    name: "Blade Mastery (energy)",
    duration: 0,
    triggers: [{ ability: "Glacial Gaze" }],
    target: { source: "sanhua", appliesTo: "sanhua" },
    modifiers: [{ class: "resonance", value: 10 }],
    sequenceReq: 4,
    // rules
    onTrigger: {
      conditions: ["isBuffTarget", "isAbility"],
      effects: ["createBuff"],
    },
    onEvent: { effects: ["applyDCondFlat"] },
  },
  {
    id: "Blade Mastery (bonus)",
    name: "Blade Mastery (bonus)",
    duration: 0.5,
    triggers: [
      {
        ability: "Detonate",
        condition: "Blade Mastery",
      },
    ],
    target: { source: "sanhua", appliesTo: "sanhua" },
    modifiers: [{ class: "bonus", value: 1.2 }],
    sequenceReq: 4,
    // rules
    onTrigger: {
      conditions: ["isBuffTarget", "isAbility", "hasConditionById"],
      effects: ["createBuff"],
    },
    onEvent: { effects: ["applyBuffStatChanges"] },
    onExpire: { effects: ["removeBuffStatChanges"] },
  },
  {
    id: "Unraveling Fate",
    name: "Unraveling Fate",
    duration: 0.5,
    triggers: [{ ability: "Detonate" }],
    target: { source: "sanhua", appliesTo: "sanhua" },
    modifiers: [{ class: "critDmg", value: 1, concerto: 7.5 }], // 2 Detonate hits
    sequenceReq: 5,
    // rules
    onTrigger: {
      conditions: ["isBuffTarget", "isAbility"],
      effects: ["createBuff"],
    },
    onEvent: { effects: ["applyBuffStatChanges"] },
    onExpire: { effects: ["removeBuffStatChanges"] },
  },
  {
    id: "Daybreak Radiance",
    name: "Daybreak Radiance",
    duration: 20,
    triggers: [{ ability: "Detonate" }],
    target: { source: "sanhua", appliesTo: "all" },
    modifiers: [{ class: "atk", value: 0.1 }],
    stackLimit: 2,
    stackInterval: 0,
    sequenceReq: 6,
    // rules
    dep: { Detonate: 1 },
    onTrigger: {
      conditions: ["isAbility", "isDamageEvent"],
      effects: ["createBuff"],
    },
    onEvent: { effects: ["addStacksToBuff", "applyStackingBuffStatChanges"] },
    onExpire: { effects: ["removeStackingBuffStatChanges"] },
  },
]

export default sanhuaBuffs
