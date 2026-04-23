import type { BuffDefinition, ECHO_SET_KEY } from "@/shared/types"

export const setBuffs: Record<ECHO_SET_KEY, BuffDefinition[]> = {
  /* Fusion */
  "Molten Rift": [
    {
      id: "Molten Rift 2pc",
      name: "Molten Rift 2pc",
      duration: 99999,
      modifiers: [{ class: "fusion", value: 0.1 }],
      // rules
      onTrigger: { conditions: ["isBuffTarget"], effects: ["createBuff"] },
      onEvent: {
        effects: ["applyBuffStatChanges"],
      },
      onExpire: {
        effects: ["removeBuffStatChanges"],
      },
    },
    {
      id: "Molten Rift 5pc",
      name: "Molten Rift 5pc",
      duration: 15,
      triggers: [{ category: "skill" }],
      modifiers: [{ class: "fusion", value: 0.3 }],
      // rules
      onTrigger: {
        conditions: ["isBuffTarget", "isCategory"],
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
  /* Other */
  "Moonlit Clouds": [
    {
      id: "Moonlit Clouds 2pc",
      name: "Moonlit Clouds 2pc",
      duration: 99999,
      modifiers: [{ class: "er", value: 0.1 }],
      // rules
      onTrigger: { conditions: ["isBuffTarget"], effects: ["createBuff"] },
      onEvent: {
        effects: ["applyBuffStatChanges"],
      },
      onExpire: {
        effects: ["removeBuffStatChanges"],
      },
    },
    {
      id: "Moonlit Clouds 5pc",
      name: "Moonlit Clouds 5pc",
      duration: 15,
      triggers: [{ category: "outro" }],
      modifiers: [{ class: "atk", value: 0.225 }],
      // rules
      onTrigger: {
        conditions: ["isBuffSource", "isCategory"],
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
  ],
  "Rejuvenating Glow": [
    {
      id: "Rejuvenating Glow 2pc",
      name: "Rejuvenating Glow 2pc",
      duration: 99999,
      modifiers: [{ class: "heal", value: 0.1 }],
      // rules
      onTrigger: { conditions: ["isBuffTarget"], effects: ["createBuff"] },
      onEvent: {
        effects: ["applyBuffStatChanges"],
      },
      onExpire: {
        effects: ["removeBuffStatChanges"],
      },
    },
    {
      id: "Rejuvenating Glow 5pc",
      name: "Rejuvenating Glow 5pc",
      duration: 30,
      triggers: [{ type: "heal" }],
      target: { appliesTo: "all" },
      modifiers: [{ class: "atk", value: 0.15 }],
      // rules
      onTrigger: { conditions: ["isHealEvent"], effects: ["createBuff"] },
      onEvent: {
        effects: ["applyBuffStatChanges"],
      },
      onExpire: {
        effects: ["removeBuffStatChanges"],
      },
    },
  ],
}

export default setBuffs
