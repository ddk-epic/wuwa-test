import type { BuffResolver } from "@/shared/types"
import {
  isBuffTarget,
  createBuff,
  applyBuffStatChanges,
  removeBuffStatChanges,
  applyStackingBuffStatChanges,
  isCategory,
  removeStackingBuffStatChanges,
  hasCondition,
  updateBuffIdentity,
  isOnCooldown,
  isOnHitEvent,
  not,
  addArg,
} from "@/simulation/helper"

const swordResolver: Record<string, BuffResolver> = {
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
    triggerRules: [isBuffTarget, addArg(hasCondition, "name")],
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

export default swordResolver
