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
} from "@/simulation/helper"

const swordResolver: Record<string, BuffResolver> = {
  "Blazing Brilliance (Atk)": {
    id: "Blazing Brilliance (Atk)",
    onTrigger: (state, buff) => {
      if (!isBuffTarget(state, buff)) return state

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
    onTrigger: (state, buff) => {
      if (!isBuffTarget(state, buff)) return state
      if (isOnCooldown(state, buff)) return state
      if (!isOnHitEvent(state)) return state

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
    id: "Blazing Brilliance (MAX)",
    onTrigger: (state, buff) => {
      if (!isBuffTarget(state, buff)) return state
      if (!hasCondition(state, buff, "name")) return state
      const buffToBeConsumedId = "Blazing Brilliance (Skill)"

      return updateBuffIdentity(state, buff, buffToBeConsumedId)
    },
    onExpire: (state, buff) => {
      return removeStackingBuffStatChanges(state, buff)
    },
  },
  "Emerald of Genesis (ER)": {
    id: "Emerald of Genesis (ER)",
    onTrigger: (state, buff) => {
      if (!isBuffTarget(state, buff)) return state

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
    onTrigger: (state, buff) => {
      if (!isBuffTarget(state, buff)) return state
      if (!isCategory(state, buff)) return state
      if (!isOnHitEvent(state)) return state

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
