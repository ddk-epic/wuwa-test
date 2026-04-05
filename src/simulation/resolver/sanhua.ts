import type { BuffResolver } from "@/shared/types"
import {
  isBuffTarget,
  createBuff,
  applyBuffStatChanges,
  isCategory,
  hasCondition,
  isAbility,
  isOnHitEvent,
  createBuffNext,
  addToBuffNext,
  removeBuffStatChanges,
  addToBuffDeferred,
  resolveDamageProcs,
  applyResonanceFlat,
  createGlobalBuff,
  applyGlobalStackingBuffStatChanges,
  removeGlobalStackingBuffStatChanges,
  addConsumeStacksToBuff,
  getStacksFromBuff,
  isOnCooldown,
} from "../helper"

const sanhuaResolver: Record<string, BuffResolver> = {
  Condensation: {
    id: "Condensation",
    onTrigger: (state, action, buff) => {
      if (!isBuffTarget(action, buff)) return state
      if (!isCategory(action, buff)) return state

      return createBuff(state, action, buff)
    },
    onCast: (state, action, buff) => {
      return applyBuffStatChanges(state, action, buff)
    },
    onExpire: (state, action, buff) => {
      return removeBuffStatChanges(state, action, buff)
    },
  },
  Avalanche: {
    id: "Avalanche",
    onTrigger: (state, action, buff) => {
      if (!isBuffTarget(action, buff)) return state
      if (!isAbility(action, buff)) return state

      return createBuff(state, action, buff)
    },
  },
  "Avalanche (bonus)": {
    id: "Avalanche (bonus)",
    onTrigger: (state, action, buff) => {
      if (!isBuffTarget(action, buff)) return state
      if (!isAbility(action, buff)) return state
      if (!hasCondition(state, action, buff)) return state
      if (!isOnHitEvent(action)) return state

      return createBuff(state, action, buff)
    },
    onHit: (state, action, buff) => {
      return applyBuffStatChanges(state, action, buff)
    },
    onExpire: (state, action, buff) => {
      return removeBuffStatChanges(state, action, buff)
    },
  },
  Silversnow: {
    id: "Silversnow",
    onTrigger: (state, action, buff) => {
      if (!isAbility(action, buff)) return state

      return addToBuffNext(state, buff)
    },
    onCast: (state, action, buff) => {
      return applyBuffStatChanges(state, action, buff)
    },
    onSwap: (state, action, buff) => {
      return createBuffNext(state, action, buff)
    },
    onExpire: (state, action, buff) => {
      return removeBuffStatChanges(state, action, buff)
    },
  },
  "Ice Prism": {
    id: "Ice Prism",
    onTrigger: (state, action, buff) => {
      if (!isBuffTarget(action, buff)) return state
      if (!isAbility(action, buff)) return state
      if (!isOnHitEvent(action)) return state

      let newState = createBuff(state, action, buff)
      return addToBuffDeferred(newState, buff)
    },
  },
  "Ice Thorn": {
    id: "Ice Thorn",
    onTrigger: (state, action, buff) => {
      if (!isBuffTarget(action, buff)) return state
      if (!isAbility(action, buff)) return state
      if (!isOnHitEvent(action)) return state

      let newState = createBuff(state, action, buff)
      return addToBuffDeferred(newState, buff)
    },
  },
  "Ice Glacier": {
    id: "Ice Glacier",
    onTrigger: (state, action, buff) => {
      if (!isBuffTarget(action, buff)) return state
      if (!isAbility(action, buff)) return state
      if (!isOnHitEvent(action)) return state

      let newState = createBuff(state, action, buff)
      return addToBuffDeferred(newState, buff)
    },
  },
  Detonate: {
    id: "Detonate",
    onTrigger: (state, action, buff) => {
      if (!isBuffTarget(action, buff)) return state
      if (!isAbility(action, buff)) return state
      if (!isOnHitEvent(action)) return state

      return createBuff(state, action, buff)
    },
    onHit: (state, action, buff) => {
      const consumeById = ["Ice Prism", "Ice Thorn", "Ice Glacier"]
      const consumeByS6 = ["Ice Prism", "Ice Glacier"]

      let newState = addConsumeStacksToBuff(state, action, buff, consumeByS6)
      return resolveDamageProcs(newState, action, buff, consumeById)
    },
  },
  "Solitude's Embrace": {
    id: "Solitude's Embrace",
    onTrigger: (state, action, buff) => {
      if (!isBuffTarget(action, buff)) return state
      if (!isAbility(action, buff)) return state
      if (!isOnHitEvent(action)) return state

      return createBuff(state, action, buff)
    },
    onHit: (state, action, buff) => {
      return applyBuffStatChanges(state, action, buff)
    },
    onExpire: (state, action, buff) => {
      return removeBuffStatChanges(state, action, buff)
    },
  },
  "Blade Mastery": {
    id: "Blade Mastery",
    onTrigger: (state, action, buff) => {
      if (!isBuffTarget(action, buff)) return state
      if (!isAbility(action, buff)) return state

      return createBuff(state, action, buff)
    },
  },
  "Blade Mastery (energy)": {
    id: "Blade Mastery (energy)",
    onTrigger: (state, action, buff) => {
      if (!isBuffTarget(action, buff)) return state
      if (!isAbility(action, buff)) return state

      return createBuff(state, action, buff)
    },
    onHit: (state, action, buff) => {
      return applyResonanceFlat(state, action, buff)
    },
  },
  "Blade Mastery (bonus)": {
    id: "Blade Mastery (bonus)",
    onTrigger: (state, action, buff) => {
      if (!isBuffTarget(action, buff)) return state
      if (!isAbility(action, buff)) return state
      if (!hasCondition(state, action, buff)) return state

      return createBuff(state, action, buff)
    },
    onHit: (state, action, buff) => {
      return applyBuffStatChanges(state, action, buff)
    },
    onExpire: (state, action, buff) => {
      return removeBuffStatChanges(state, action, buff)
    },
  },
  "Unraveling Fate": {
    id: "Unraveling Fate",
    onTrigger: (state, action, buff) => {
      if (!isBuffTarget(action, buff)) return state
      if (!isAbility(action, buff)) return state

      return createBuff(state, action, buff)
    },
    onHit: (state, action, buff) => {
      return applyBuffStatChanges(state, action, buff)
    },
    onExpire: (state, action, buff) => {
      return removeBuffStatChanges(state, action, buff)
    },
  },
  "Daybreak Radiance": {
    id: "Daybreak Radiance",
    onTrigger: (state, action, buff) => {
      if (!isAbility(action, buff)) return state
      if (!isOnHitEvent(action)) return state
      if (isOnCooldown(state, buff)) return state

      return createGlobalBuff(state, action, buff)
    },
    onHit: (state, action, buff) => {
      const buffById = "Detonate"
      const stacksToAdd = getStacksFromBuff(state, action, buff, buffById)
      if (!stacksToAdd) return state

      return applyGlobalStackingBuffStatChanges(
        state,
        action,
        buff,
        stacksToAdd,
      )
    },
    onExpire: (state, action, buff) => {
      return removeGlobalStackingBuffStatChanges(state, action, buff)
    },
  },
}

export default sanhuaResolver
