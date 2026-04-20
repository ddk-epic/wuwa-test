import type { BuffResolver } from "@/shared/types"
import {
  addToBuffNext,
  applyBuffStatChanges,
  applyStackingBuffStatChanges,
  createBuff,
  createBuffNext,
  createHealProcEvent,
  getBuffById,
  getStacksFromStatReq,
  hasCondition,
  isAbility,
  isBuffTarget,
  isCategoryWithCondition,
  isOnCastEvent,
  removeBuffStatChanges,
  removeStackingBuffStatChanges,
} from "@/simulation/helper"

const shorekeeperResolver: Record<string, BuffResolver> = {
  "Self Gravitation": {
    id: "Self Gravitation",
    triggerRules: [isBuffTarget, hasCondition],
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
  "Binary Butterfly": {
    id: "Binary Butterfly",
    triggerRules: [isAbility, isOnCastEvent],
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
  "Outer Stellarealm": {
    id: "Outer Stellarealm",
    triggerRules: [isAbility, isOnCastEvent],
    onTrigger: (state, buff) => {
      let newState = createHealProcEvent(state, buff)
      return createBuff(newState, buff)
    },
  },
  "Inner Stellarealm": {
    id: "Inner Stellarealm",
    triggerRules: [isCategoryWithCondition, isOnCastEvent],
    onTrigger: (state, buff) => {
      // copy buff duration
      const depBuffId = "Outer Stellarealm"
      const depBuff = getBuffById(state, depBuffId)
      if (!depBuff) return state

      let newState = createBuff(state, buff, depBuff.endTime)

      // update buff on init
      const newBuff = getBuffById(newState, buff.id)
      const stacksToAdd = getStacksFromStatReq(newState, buff)
      if (!newBuff || !stacksToAdd) return newState

      return applyStackingBuffStatChanges(newState, newBuff, stacksToAdd)
    },
    onHit: (state, buff) => {
      const stacksToAdd = getStacksFromStatReq(state, buff)
      if (!stacksToAdd) return state

      return applyStackingBuffStatChanges(state, buff, stacksToAdd)
    },
    onExpire: (state, buff) => {
      return removeStackingBuffStatChanges(state, buff)
    },
  },
  "Supernal Stellarealm": {
    id: "Supernal Stellarealm",
    triggerRules: [isCategoryWithCondition, isOnCastEvent],
    onTrigger: (state, buff) => {
      // create buff
      let newState = createBuff(state, buff)

      // update buff on init
      const newBuff = getBuffById(newState, buff.id)
      const stacksToAdd = getStacksFromStatReq(newState, buff)
      if (!newBuff || !stacksToAdd) return newState

      return applyStackingBuffStatChanges(newState, newBuff, stacksToAdd)
    },
    onHit: (state, buff) => {
      const stacksToAdd = getStacksFromStatReq(state, buff)
      if (!stacksToAdd) return state

      return applyStackingBuffStatChanges(state, buff, stacksToAdd)
    },
    onExpire: (state, buff) => {
      return removeStackingBuffStatChanges(state, buff)
    },
  },
}

export default shorekeeperResolver
