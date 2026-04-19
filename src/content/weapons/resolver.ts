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
  addArgs,
  hasCondition,
  updateBuffIdentity,
} from "@/simulation/helper"

const weaponResolver: Record<string, BuffResolver> = {
  /* Rectifiers */
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
  /* Swords */
  "Blazing Brilliance (Atk)": {
    id: "Blazing Brilliance (Atk)",
    triggerRules: [isBuffTarget],
    onTrigger: (state, buff) => {
      return createBuff(state, buff)
    },
    onHit: (state, buff) => {
      return applyBuffStatChanges(state, buff)
    },
    onExpire: (state, buff) => {
      return removeBuffStatChanges(state, buff)
    },
  },
  "Blazing Brilliance (Skill)": {
    id: "Blazing Brilliance (Skill)",
    triggerRules: [isBuffTarget, not(isOnCooldown), isOnHitEvent],
    onTrigger: (state, buff) => {
      return createBuff(state, buff)
    },
    onHit: (state, buff) => {
      if (isOnCooldown(state, buff)) return state

      const stacksToAdd = isCategory(state, buff, "skill") ? 5 : 1
      return applyStackingBuffStatChanges(state, buff, stacksToAdd)
    },
    onExpire: (state, buff) => {
      return removeStackingBuffStatChanges(state, buff)
    },
  },
  "Blazing Brilliance (MAX)": {
    // TODO: make MAX conversation innate
    id: "Blazing Brilliance (MAX)",
    triggerRules: [isBuffTarget, addArgs(hasCondition, "name")],
    onTrigger: (state, buff) => {
      const buffToBeConsumedId = "Blazing Brilliance (Skill)"
      return updateBuffIdentity(state, buff, buffToBeConsumedId)
    },
    onExpire: (state, buff) => {
      return removeStackingBuffStatChanges(state, buff)
    },
  },
  "Emerald of Genesis (ER)": {
    id: "Emerald of Genesis (ER)",
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
  "Emerald of Genesis (Atk)": {
    id: "Emerald of Genesis (Atk)",
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
}

export default weaponResolver
