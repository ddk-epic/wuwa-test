import type { BuffDefinition } from "@/shared/types"

const encoreBuffs: BuffDefinition[] = [
  {
    id: "Angry Cosmos",
    name: "Angry Cosmos",
    duration: 10,
    triggers: [{ ability: "Cosmos Rave" }],
    target: { source: "encore", appliesTo: "encore" },
    modifiers: [{ class: "all", value: 0.1 }],
    // rules
    onTrigger: {
      conditions: ["isBuffTarget", "isAbility"],
      effects: ["createBuff"],
    },
    onEvent: { effects: ["applyBuffStatChanges"] },
    onExpire: { effects: ["removeBuffStatChanges"] },
  },
  {
    id: "Woolies Cheer Dance",
    name: "Woolies Cheer Dance",
    duration: 10,
    triggers: [{ ability: "Flaming Woolies" }, { ability: "Cosmos Rampage" }],
    target: { source: "encore", appliesTo: "encore" },
    modifiers: [{ class: "fusion", value: 0.1 }],
    // rules
    onTrigger: {
      conditions: ["isBuffTarget", "isAbility"],
      effects: ["createBuff"],
    },
    onEvent: { effects: ["applyBuffStatChanges"] },
    onExpire: { effects: ["removeBuffStatChanges"] },
  },
  {
    id: "Cosmos Rave",
    name: "Cosmos Rave",
    duration: 10,
    triggers: [{ ability: "Cosmos Rave" }],
    target: { source: "encore", appliesTo: "encore" },
    // rules
    onTrigger: {
      conditions: ["isBuffTarget", "isAbility"],
      effects: ["createBuff"],
    },
  },
  {
    id: "Wooly's Fairy Tale",
    name: "Wooly's Fairy Tale",
    duration: 6,
    triggers: [{ category: "basic" }],
    target: { source: "encore", appliesTo: "encore" },
    modifiers: [{ class: "fusion", value: 0.03 }],
    stackLimit: 4,
    sequenceReq: 1,
    // rules
    onTrigger: {
      conditions: ["isBuffTarget", "isCategory", "isDamageEvent"],
      effects: ["createBuff"],
    },
    onEvent: {
      conditions: ["isDamageEvent"],
      effects: ["applyStackingBuffStatChanges"],
    },
    onExpire: { effects: ["removeStackingBuffStatChanges"] },
  },
  {
    id: "Sheep-counting Lullaby",
    name: "Sheep-counting Lullaby",
    duration: 0,
    triggers: [{ category: "basic" }],
    target: { source: "encore", appliesTo: "encore" },
    modifiers: [{ class: "resonance", value: 10 }],
    cooldown: 10,
    sequenceReq: 2,
    // rules
    onTrigger: {
      conditions: [
        "isBuffTarget",
        "isCategory",
        "isDamageEvent",
        "isNotOnCooldown",
      ],
      effects: ["createBuff"],
    },
    onEvent: { effects: ["applyDCondFlat"] },
  },
  {
    id: "Fog? The Black Shores!",
    name: "Fog? The Black Shores!",
    duration: 4,
    triggers: [{ ability: "Cloudy Frenzy" }, { ability: "Cosmos Rupture" }],
    target: { source: "encore", appliesTo: "encore" },
    modifiers: [{ class: "multiplier", value: 0.4 }],
    sequenceReq: 3,
    // rules
    onTrigger: {
      conditions: ["isBuffTarget", "isAbility"],
      effects: ["createBuff"],
    },
    onEvent: { effects: ["applyBuffStatChanges"] },
    onExpire: { effects: ["removeBuffStatChanges"] },
  },
  {
    id: "Adventure? Let's go!",
    name: "Adventure? Let's go!",
    duration: 30,
    triggers: [{ ability: "Cosmos Rupture" }],
    target: { source: "encore", appliesTo: "all" },
    modifiers: [{ class: "fusion", value: 0.2 }],
    sequenceReq: 4,
    // rules
    onTrigger: {
      conditions: ["isBuffGlobal", "isAbility"],
      effects: ["createBuff"],
    },
    onEvent: { effects: ["applyBuffStatChanges"] },
    onExpire: { effects: ["removeBuffStatChanges"] },
  },
  {
    id: "Hero Takes the Stage!",
    name: "Hero Takes the Stage!",
    duration: 99999,
    target: { source: "encore", appliesTo: "encore" },
    modifiers: [{ class: "skill", value: 0.35 }],
    sequenceReq: 5,
    // rules
    onTrigger: { conditions: ["isBuffTarget"], effects: ["createBuff"] },
    onEvent: { effects: ["applyBuffStatChanges"] },
    onExpire: { effects: ["removeBuffStatChanges"] },
  },
  {
    id: "Woolies Save the World!",
    name: "Woolies Save the World!",
    duration: 10,
    triggers: [{ ability: "all", condition: "Cosmos Rave" }],
    target: { source: "encore", appliesTo: "encore" },
    modifiers: [{ class: "atk", value: 0.05 }],
    stackLimit: 5,
    stackInterval: 0,
    sequenceReq: 6,
    // rules
    onTrigger: {
      conditions: ["isBuffTarget", "hasConditionById", "isDamageEvent"],
      effects: ["createBuff"],
    },
    onEvent: {
      conditions: ["isDamageEvent"],
      effects: ["applyStackingBuffStatChanges"],
    },
    onExpire: { effects: ["removeStackingBuffStatChanges"] },
  },
]

export default encoreBuffs
