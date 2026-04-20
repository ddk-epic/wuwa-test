import type { BuffDefinition, ECHO_SET_KEY } from "@/shared/types"

export const setBuffs: Record<ECHO_SET_KEY, BuffDefinition[]> = {
  /* Fusion */
  "Molten Rift": [
    {
      id: "Molten Rift 2pc",
      name: "Molten Rift 2pc",
      modifiers: [{ class: "fusion", value: 0.1 }],
      duration: 99999,
    },
    {
      id: "Molten Rift 5pc",
      name: "Molten Rift 5pc",
      trigger: [{ category: "skill" }],
      modifiers: [{ class: "fusion", value: 0.3 }],
      duration: 15,
    },
  ],
  /* Other */
  "Moonlit Clouds": [
    {
      id: "Moonlit Clouds 2pc",
      name: "Moonlit Clouds 2pc",
      modifiers: [{ class: "er", value: 0.1 }],
      duration: 99999,
    },
    {
      id: "Moonlit Clouds 5pc",
      name: "Moonlit Clouds 5pc",
      trigger: [{ category: "outro" }],
      modifiers: [{ class: "atk", value: 0.225 }],
      duration: 15,
    },
  ],
  "Rejuvenating Glow": [
    {
      id: "Rejuvenating Glow 2pc",
      name: "Rejuvenating Glow 2pc",
      modifiers: [{ class: "heal", value: 0.1 }],
      duration: 99999,
    },
    {
      id: "Rejuvenating Glow 5pc",
      name: "Rejuvenating Glow 5pc",
      trigger: [{ type: "heal" }],
      appliesTo: "all",
      modifiers: [{ class: "atk", value: 0.15 }],
      duration: 30,
    },
  ],
}

export default setBuffs
