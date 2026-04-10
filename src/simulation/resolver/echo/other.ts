import type { BuffResolver } from "@/shared/types"
import {
  isBuffTarget,
  isAbility,
  createBuff,
  isOnHitEvent,
  applyDCondFlat,
  applyBuffStatChanges,
  removeBuffStatChanges,
  isCategory,
  addToBuffNext,
  createBuffNext,
  hasCondition,
  removeCondition,
  addArgs,
} from "@/simulation/helper"

const otherEchoResolver: Record<string, BuffResolver> = {
  "Impermanence Heron (energy)": {
    id: "Impermanence Heron (energy)",
    triggerRules: [isBuffTarget, isAbility, isOnHitEvent],
    onTrigger: (state, buff) => {
      // TODO: trigger on [hit 3]
      return createBuff(state, buff)
    },
    onHit: (state, buff) => {
      return applyDCondFlat(state, buff)
    },
  },
  "Impermanence Heron (Dormant)": {
    id: "Impermanence Heron (Dormant)",
    triggerRules: [isBuffTarget, isAbility],
    onTrigger: (state, buff) => {
      return createBuff(state, buff)
    },
  },
  "Impermanence Heron": {
    id: "Impermanence Heron",
    triggerRules: [isCategory, addArgs(hasCondition, "name")],
    onTrigger: (state, buff) => {
      let newState = removeCondition(state, buff)
      return addToBuffNext(newState, buff)
    },
    onCast: (state, buff) => {
      return applyBuffStatChanges(state, buff)
    },
    onSwap: (state, buff) => {
      return createBuffNext(state, buff)
    },
    onExpire: (state, buff) => {
      return removeBuffStatChanges(state, buff)
    },
  },
}

export default otherEchoResolver
