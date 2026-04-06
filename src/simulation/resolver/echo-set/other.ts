import type { BuffResolver } from "@/shared/types"
import {
  isBuffTarget,
  createBuff,
  applyBuffStatChanges,
  removeBuffStatChanges,
  addToBuffNext,
  createBuffNext,
  isCategory,
  isBuffSource,
} from "@/simulation/helper"

const otherSetResolver: Record<string, BuffResolver> = {
  "Moonlit Clouds 2pc": {
    id: "Moonlit Clouds 2pc",
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
  "Moonlit Clouds 5pc": {
    id: "Moonlit Clouds 5pc",
    onTrigger: (state, buff) => {
      if (!isBuffSource(state, buff)) return state
      if (!isCategory(state, buff)) return state

      return addToBuffNext(state, buff)
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

export default otherSetResolver
