import type { BuffResolver } from "@/shared/types"
import {
  isBuffTarget,
  createBuff,
  applyBuffStatChanges,
  removeBuffStatChanges,
  isCategory,
  applyStackingBuffStatChanges,
  removeStackingBuffStatChanges,
  isOnField,
  getStacksFromBuff,
  isOnHitEvent,
  applyDCondFlat,
  isOnCooldown,
  not,
} from "@/simulation/helper"

const rectifierResolver: Record<string, BuffResolver> = {
  "Stringmaster (Ele)": {
    id: "Stringmaster (Ele)",
    triggerRules: [isBuffTarget],
    onTrigger: (state, buff) => {
      return createBuff(state, buff)
    },
    onCast: (state, buff) => {
      return applyBuffStatChanges(state, buff)
    },
    onExpire: (state, buff) => {
      return removeBuffStatChanges(state, buff)
    },
  },
  "Stringmaster (Atk)": {
    id: "Stringmaster (Atk)",
    triggerRules: [isBuffTarget, isCategory, isOnHitEvent],
    onTrigger: (state, buff) => {
      return createBuff(state, buff)
    },
    onHit: (state, buff) => {
      return applyStackingBuffStatChanges(state, buff)
    },
    onExpire: (state, buff) => {
      return removeStackingBuffStatChanges(state, buff)
    },
  },
  "Stringmaster (Off-field)": {
    id: "Stringmaster (Off-field)",
    triggerRules: [isBuffTarget, isCategory, not(isOnField), isOnHitEvent],
    onTrigger: (state, buff) => {
      return createBuff(state, buff)
    },
    onHit: (state, buff) => {
      const buffById = "Stringmaster (Atk)"
      const stacksToAdd = getStacksFromBuff(state, buffById)
      return applyStackingBuffStatChanges(state, buff, stacksToAdd)
    },
    onExpire: (state, buff) => {
      return removeStackingBuffStatChanges(state, buff)
    },
  },
  // "Stellar Symphony": {
  //   id: "Stellar Symphony",
  //   onTrigger: (state, buff) => {
  //     return state
  //   },
  // },
  Variation: {
    id: "Variation",
    triggerRules: [isBuffTarget, isCategory, not(isOnCooldown)],
    onTrigger: (state, buff) => {
      return createBuff(state, buff)
    },
    onCast: (state, buff) => {
      return applyDCondFlat(state, buff)
    },
  },
}

export default rectifierResolver
