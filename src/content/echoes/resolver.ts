import type { BuffResolver } from "@/shared/types"
import {
  addToBuffNext,
  applyBuffStatChanges,
  applyDCondFlat,
  createBuff,
  createBuffNext,
  isAbility,
  isBuffTarget,
  isIndex,
  isOnHitEvent,
  removeBuffStatChanges,
  removeCondition,
  isCategoryWithCondition,
} from "@/simulation/helper"

const echoResolver: Record<string, BuffResolver> = {
  /* Fusion */
  "Inferno Rider (Fusion/Basic)": {
    id: "Inferno Rider (Fusion/Basic)",
    triggerRules: [isBuffTarget, isAbility, isIndex],
    onTrigger: (state, buff) => {
      // TODO: trigger on [hit 3]
      return createBuff(state, buff)
    },
    onHit: (state, buff) => {
      return applyBuffStatChanges(state, buff)
    },
    onExpire: (state, buff) => {
      return removeBuffStatChanges(state, buff)
    },
  },
  /* Other */
  "Fallacy of No Return (Energy)": {
    id: "Fallacy of No Return (Energy)",
    triggerRules: [isAbility],
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
  "Fallacy of No Return": {
    id: "Fallacy of No Return",
    triggerRules: [isAbility],
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
  "Impermanence Heron (Energy)": {
    id: "Impermanence Heron (Energy)",
    triggerRules: [isBuffTarget, isAbility, isOnHitEvent],
    onTrigger: (state, buff) => {
      // TODO: trigger on [hit 3]
      return createBuff(state, buff)
    },
    onHit: (state, buff) => {
      return applyDCondFlat(state, buff)
    },
  },
  "Impermanence Heron": {
    id: "Impermanence Heron",
    triggerRules: [isBuffTarget, isAbility],
    onTrigger: (state, buff) => {
      return createBuff(state, buff)
    },
  },
  "Impermanence Heron (Buff)": {
    id: "Impermanence Heron (Buff)",
    triggerRules: [isCategoryWithCondition],
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

export default echoResolver
