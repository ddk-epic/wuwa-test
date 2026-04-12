import type { BuffDefinition } from "@/shared/types"

const verina: BuffDefinition[] = [
  {
    id: "Grace of Life",
    name: "Grace of Life",
    source: "verina",
    appliesTo: "verina",
    duration: 99999,
  },
  {
    id: "Gift of Nature",
    name: "Gift of Nature",
    source: "verina",
    trigger: { ability: ["Blossom"], category: ["forte"] },
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
    id: "Coord. Attack (Spectro)",
    name: "Coord. Attack (Spectro)",
    source: "verina",
    trigger: { ability: ["any"], condition: ["Photosynthesis Mark"] },
    appliesTo: "current",
    modifiers: [
      { class: "spectro", value: 0.0995 },
      { class: "heal", value: 0.1071, flatValue: 428 },
    ],
    duration: 12,
    cooldown: 1,
  },
  {
    id: "Starflower Blooms 1",
    name: "Starflower Blooms 1",
    source: "verina",
    trigger: { ability: ["Starflower Blooms 1"] },
    appliesTo: "verina",
    modifiers: [
      { class: "spectro", value: 0.3402, concerto: 12 },
      { class: "heal", value: 0.2975, flatValue: 1188 },
    ],
    duration: 0,
  },
  {
    id: "Starflower Blooms 2",
    name: "Starflower Blooms 2",
    source: "verina",
    trigger: { ability: ["Starflower Blooms 2"] },
    appliesTo: "verina",
    modifiers: [
      { class: "spectro", value: 0.321, concerto: 12 },
      { class: "heal", value: 0.2975, flatValue: 1188 },
    ],
    duration: 0,
  },
  {
    id: "Starflower Blooms 3",
    name: "Starflower Blooms 3",
    source: "verina",
    trigger: { ability: ["Starflower Blooms 3"] },
    appliesTo: "verina",
    modifiers: [
      { class: "spectro", value: 0.1534, concerto: 12 },
      { class: "spectro", value: 0.1534 },
      { class: "spectro", value: 0.1534 },
      { class: "heal", value: 0.2975, flatValue: 1188 },
    ],
    duration: 0,
  },
  {
    id: "Starflower Blooms Heavy",
    name: "Starflower Blooms Heavy",
    source: "verina",
    trigger: { ability: ["Starflower Blooms 2"] },
    appliesTo: "verina",
    modifiers: [
      { class: "spectro", value: 0.3267, concerto: 12 },
      { class: "spectro", value: 0.49 },
      { class: "heal", value: 0.2975, flatValue: 1188 },
    ],
    duration: 0,
  },
]

export default verina
