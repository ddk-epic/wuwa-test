import type { BuffResolver } from "@/shared/types"
import {
  isBuffTarget,
  createBuff,
  applyBuffStatChanges,
  removeBuffStatChanges,
  isCategory,
} from "@/simulation/helper"

const fusionSetResolver: Record<string, BuffResolver> = {
  "Molten Rift 2pc": {
    id: "Molten Rift 2pc",
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
  "Molten Rift 5pc": {
    id: "Molten Rift 5pc",
    onTrigger: (state, buff) => {
      if (!isBuffTarget(state, buff)) return state
      if (!isCategory(state, buff)) return state

      return createBuff(state, buff)
    },
    onCast: (state, buff) => {
      return applyBuffStatChanges(state, buff)
    },
    onExpire: (state, buff) => {
      return removeBuffStatChanges(state, buff)
    },
  },
}

export default fusionSetResolver
