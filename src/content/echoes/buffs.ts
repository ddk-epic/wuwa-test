import type { BuffDefinition } from "@/shared/types"

const echoBuffs: Record<string, BuffDefinition[]> = {
  /* Fusion */
  "Inferno Rider": [
    {
      id: "Inferno Rider (Fusion/Basic)",
      name: "Inferno Rider (Fusion/Basic)",
      duration: 15,
      triggers: [{ ability: "Inferno Rider", index: 3 }],
      modifiers: [
        { class: "fusion", value: 0.12 },
        { class: "basic", value: 0.12 },
      ],
      // rules
      onTrigger: {
        conditions: ["isBuffTarget", "isAbility", "isIndex"],
        effects: ["createBuff"],
      },
      onEvent: { effects: ["applyBuffStatChanges"] },
      onExpire: { effects: ["removeBuffStatChanges"] },
    },
  ],
  /* Other */
  "Fallacy of No Return": [
    {
      id: "Fallacy of No Return (Energy)",
      name: "Fallacy of No Return (Energy)",
      duration: 20,
      triggers: [{ ability: "Fallacy of No Return" }],
      modifiers: [{ class: "er", value: 0.1 }],
      // rules
      onTrigger: {
        conditions: ["isAbility"],
        effects: ["createBuff"],
      },
      onEvent: { effects: ["applyBuffStatChanges"] },
      onExpire: { effects: ["removeBuffStatChanges"] },
    },
    {
      id: "Fallacy of No Return",
      name: "Fallacy of No Return",
      duration: 20,
      triggers: [{ ability: "Fallacy of No Return" }],
      target: { appliesTo: "all" },
      modifiers: [{ class: "atk", value: 0.1 }],
      // rules
      onTrigger: { conditions: ["isAbility"], effects: ["createBuff"] },
      onEvent: { effects: ["applyBuffStatChanges"] },
      onExpire: { effects: ["removeBuffStatChanges"] },
    },
  ],
  "Impermanence Heron": [
    {
      id: "Impermanence Heron (Energy)",
      name: "Impermanence Heron (Energy)",
      duration: 0,
      triggers: [{ ability: "Impermanence Heron" }],
      modifiers: [{ class: "er", value: 10 }],
      // rules
      onTrigger: {
        conditions: ["isCategory", "hasConditionById"],
        effects: ["createBuff"],
      },
      onEvent: {
        effects: ["applyDCondFlat"],
      },
    },
    {
      id: "Impermanence Heron (Dormant)",
      name: "Impermanence Heron (Dormant)",
      duration: 15,
      triggers: [{ ability: "Impermanence Heron" }],
      modifiers: [],
      // rules
      onTrigger: {
        conditions: ["isBuffTarget", "isAbility"],
        effects: ["createBuff"],
      },
    },
    {
      id: "Impermanence Heron",
      name: "Impermanence Heron",
      duration: 15,
      triggers: [
        {
          category: "outro",
          condition: "Impermanence Heron (Dormant)",
        },
      ],
      modifiers: [{ class: "all", value: 0.12 }],
      // rules
      onTrigger: {
        conditions: ["isCategory", "hasConditionByName"],
        effects: ["addToBuffNext", "removeCondition"],
      },
      onSwap: { effects: ["createBuffNext"] },
      onEvent: { effects: ["applyBuffStatChanges"] },
      onExpire: { effects: ["removeBuffStatChanges"] },
    },
  ],
}

export default echoBuffs
