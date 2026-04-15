import type { BuffDefinition } from "@/shared/types"

const verina: BuffDefinition[] = [
  {
    id: "Gift of Nature",
    name: "Gift of Nature",
    source: "verina",
    trigger: {
      ability: [
        "Blossom",
        "Starflower Blooms 1",
        "Starflower Blooms 2",
        "Starflower Blooms 3",
        "Starflower Blooms Heavy",
      ],
    },
    appliesTo: "all",
    modifiers: [{ class: "atk", value: 0.2 }],
    duration: 20,
  },
  {
    id: "Blossom",
    name: "Blossom",
    source: "verina",
    trigger: { ability: ["Blossom"] },
    appliesTo: "all",
    modifiers: [{ class: "allDeep", value: 0.15 }],
    duration: 30,
  },
  {
    id: "Photosynthesis Mark",
    name: "Photosynthesis Mark",
    source: "verina",
    trigger: { ability: ["Arboreal Flourish"] },
    appliesTo: "enemy",
    duration: 12,
  },
  {
    id: "Arboreal Flourish (Coord)",
    name: "Arboreal Flourish (Coord)",
    source: "verina",
    trigger: { ability: ["any"], condition: ["Photosynthesis Mark"] },
    appliesTo: "verina",
    modifiers: [
      { class: "spectro", frame: 10, value: 0.05, type: "coord" },
      { class: "heal", frame: 10, value: 0.1071, flatValue: 428, type: "heal" },
    ],
    duration: 12,
    cooldown: 1,
  },
]

export default verina
