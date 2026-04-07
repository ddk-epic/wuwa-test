import type { BuffResolver } from "@/shared/types"
import {
  isBuffTarget,
  isAbility,
  createBuff,
  isOnHitEvent,
  applyResonanceFlat,
  applyBuffStatChanges,
  removeBuffStatChanges,
  isCategory,
  addToBuffNext,
  createBuffNext,
  hasCondition,
  removeCondition,
} from "@/simulation/helper"

const otherEchoResolver: Record<string, BuffResolver> = {
  "Impermanence Heron (energy)": {
    id: "Impermanence Heron (energy)",
    onTrigger: (state, buff) => {
      // TODO: trigger on [hit 3]
      if (!isBuffTarget(state, buff)) return state
      if (!isAbility(state, buff)) return state
      if (!isOnHitEvent(state)) return state

      return createBuff(state, buff)
    },
    onHit: (state, buff) => {
      return applyResonanceFlat(state, buff)
    },
  },
  "Impermanence Heron (Dormant)": {
    id: "Impermanence Heron (Dormant)",
    onTrigger: (state, buff) => {
      if (!isBuffTarget(state, buff)) return state
      if (!isAbility(state, buff)) return state

      return createBuff(state, buff)
    },
  },
  "Impermanence Heron": {
    id: "Impermanence Heron",
    onTrigger: (state, buff) => {
      if (!isCategory(state, buff)) return state
      if (!hasCondition(state, buff, "name")) return state

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
