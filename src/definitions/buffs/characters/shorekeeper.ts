import type { BuffDefinition } from "@/shared/types"

const shorekeeper: BuffDefinition[] = [
  {
    id: "Self Gravitation",
    name: "Self Gravitation",
    source: "shorekeeper",
    trigger: {
      mode: ["Outer Stellarealm", "Inner Stellarealm", "Supernal Stellarealm"],
    },
    appliesTo: "shorekeeper",
    modifiers: [{ class: "er", value: 0.1 }],
    duration: 0,
  },
  // {
  //   id: "Self Gravitation (rover)",
  //   name: "Self Gravitation (rover)",
  //   source: "shorekeeper",
  //   trigger: {
  //     mode: ["Outer Stellarealm", " Inner Stellarealm", "Supernal Stellarealm"],
  //   },
  //   appliesTo: "rover",
  //   modifiers: [{ class: "er", value: 0.1 }],
  //   duration: 0,
  // },
  {
    id: "Binary Butterfly",
    name: "Binary Butterfly",
    source: "shorekeeper",
    trigger: { ability: ["Binary Butterfly"] },
    appliesTo: "all",
    modifiers: [{ class: "allDeep", value: 0.15 }],
    duration: 14,
  },
  {
    id: "Outer Stellarealm",
    name: "Outer Stellarealm",
    source: "shorekeeper",
    trigger: { ability: ["End Loop"] },
    appliesTo: "all",
    modifiers: [],
    duration: 30,
  },
  // {
  //   id: "Outer Stellarealm (heal)",
  //   name: "Outer Stellarealm (heal)",
  //   type: "Heal",
  //   source: "shorekeeper",
  //   trigger: {
  //     mode: [
  //       "Outer Stellarealm",
  //       "Inner Stellarealm",
  //       "Supernal Stellarealm",
  //     ],
  //   },
  //   appliesTo: "current",
  //   modifiers: [{ class: "heal", value: 0.012, flatValue: 220 }], // TODO: implement heal
  //   duration: 30,
  // },
  {
    id: "Inner Stellarealm",
    name: "Inner Stellarealm",
    source: "shorekeeper",
    trigger: { category: ["intro"], mode: ["Outer Stellarealm"] },
    appliesTo: "all",
    modifiers: [],
    duration: 30,
  },
  {
    id: "Supernal Stellarealm",
    name: "Supernal Stellarealm",
    source: "shorekeeper",
    trigger: { category: ["intro"], mode: ["Inner Stellarealm"] },
    appliesTo: "all",
    modifiers: [],
    duration: 30,
  },
  {
    id: "Inner Stellarealm (On-Field)",
    name: "Inner Stellarealm (On-Field)",
    source: "shorekeeper",
    trigger: { ability: ["all"], mode: ["Inner Stellarealm"] },
    appliesTo: "all",
    modifiers: [{ class: "crit", statReq: "er", value: 0.01 }], // TODO
    duration: 30,
  },
  {
    id: "Supernal Stellarealm (On-Field)",
    name: "Supernal Stellarealm (On-Field)",
    source: "shorekeeper",
    trigger: { ability: ["all"], mode: ["Inner Stellarealm"] },
    appliesTo: "all",
    modifiers: [{ class: "critDmg", statReq: "er", value: 0.01 }], // TODO
    duration: 30,
  },
]

export default shorekeeper