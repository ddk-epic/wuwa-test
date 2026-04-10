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
    appliesTo: "next",
    modifiers: [{ class: "allDeep", value: 0.15 }],
    duration: 30,
  },
  {
    id: "Arboreal Flourish",
    name: "Arboreal Flourish",
    source: "verina",
    trigger: { ability: ["Arboreal Flourish"] },
    appliesTo: "verina",
    modifiers: [{ class: "allDeep", value: 0.15 }],
    duration: 30,
  },
  // {
  //   id: "Photosynthesis Mark",
  //   name: "Photosynthesis Mark",
  //   source: "verina",
  //   trigger: { ability: ["any"], condition: ["Arboreal Flourish"] },
  //   appliesTo: "all",
  //   duration: 30,
  // },
  
]

export default verina
