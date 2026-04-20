import type { BuffResolver } from "@/shared/types"
import {
  isBuffTarget,
  createBuff,
  applyBuffStatChanges,
  removeBuffStatChanges,
  isCategory,
  addToBuffNext,
  createBuffNext,
  isBuffSource,
  isHealEvent,
} from "@/simulation/helper"

const echoSetResolver: Record<string, BuffResolver> = {
  /* Fusion */
  "Molten Rift 2pc": {
    id: "Molten Rift 2pc",
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
  "Molten Rift 5pc": {
    id: "Molten Rift 5pc",
    triggerRules: [isBuffTarget, isCategory],
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
  /* Other */
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
    triggerRules: [isHealEvent],
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

export default echoSetResolver
