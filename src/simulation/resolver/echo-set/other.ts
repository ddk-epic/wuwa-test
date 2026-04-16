import type { BuffResolver } from "@/shared/types"
import {
  addToBuffNext,
  applyBuffStatChanges,
  createBuff,
  createBuffNext,
  isBuffSource,
  isBuffTarget,
  isCategory,
  isHeal,
  removeBuffStatChanges,
} from "@/simulation/helper"

const otherSetResolver: Record<string, BuffResolver> = {
  "Moonlit Clouds 2pc": {
    id: "Moonlit Clouds 2pc",
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
  "Moonlit Clouds 5pc": {
    id: "Moonlit Clouds 5pc",
    triggerRules: [isBuffSource, isCategory],
    onTrigger: (state, buff) => {
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
  "Rejuvenating Glow 2pc": {
    id: "Rejuvenating Glow 2pc",
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
  "Rejuvenating Glow 5pc": {
    id: "Rejuvenating Glow 5pc",
    triggerRules: [isHeal],
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
}

export default otherSetResolver
