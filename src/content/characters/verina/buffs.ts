import type { BuffDefinition } from "@/shared/types"

const verinaBuffs: BuffDefinition[] = [
  {
    id: "Gift of Nature",
    name: "Gift of Nature",
    duration: 20,
    triggers: [
      {
        ability: "Starflower Blooms 1",
      },
      {
        ability: "Starflower Blooms 2",
      },
      {
        ability: "Starflower Blooms 3",
      },
      {
        ability: "Starflower Blooms Heavy",
      },
      { ability: "Arboreal Flourish" },
      {
        ability: "Blossom",
      },
    ],
    target: { source: "verina", appliesTo: "all" },
    modifiers: [{ class: "atk", value: 0.2 }],
    // rules
    onTrigger: { conditions: ["isAbility"], effects: ["createBuff"] },
    onEvent: { effects: ["applyBuffStatChanges"] },
    onExpire: { effects: ["removeBuffStatChanges"] },
  },
  {
    id: "Blossom",
    name: "Blossom",
    duration: 30,
    triggers: [{ ability: "Blossom" }],
    target: { source: "verina", appliesTo: "all" },
    modifiers: [{ class: "allDeep", value: 0.15 }],
    // rules
    onTrigger: { conditions: ["isAbility"], effects: ["addToBuffNext"] },
    onSwap: { effects: ["createBuffNext"] },
    onEvent: { effects: ["applyBuffStatChanges"] },
    onExpire: { effects: ["removeBuffStatChanges"] },
  },
  {
    id: "Photosynthesis Mark",
    name: "Photosynthesis Mark",
    duration: 12,
    triggers: [{ ability: "Arboreal Flourish" }],
    target: { source: "verina", appliesTo: "enemy" },
    // rules
    onTrigger: { conditions: ["isAbility"], effects: ["createBuff"] },
  },
  {
    id: "Arboreal Flourish (Coord)",
    name: "Arboreal Flourish (Coord)",
    duration: 12,
    cooldown: 1,
    triggers: [{ ability: "any", condition: "Photosynthesis Mark" }],
    target: { source: "verina", appliesTo: "verina" },
    modifiers: [
      { class: "spectro", frame: 10, value: 0.05, type: "coord" },
      { class: "heal", frame: 10, value: 0.1071, flat: 428, type: "heal" },
    ],
    // rules
    dep: { "Photosynthesis Mark": 1 },
    onTrigger: {
      conditions: ["hasConditionById", "isNotOnCooldown", "isDamageEvent"],
      effects: ["createCoordProcEvent"],
    },
  },
]

export default verinaBuffs
