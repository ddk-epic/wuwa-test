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
} from "../../helper"

const sanhuaResolver: Record<string, BuffResolver> = {
  Condensation: {
    id: "Condensation",
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
  Avalanche: {
    id: "Avalanche",
    onTrigger: (state, buff) => {
      if (!isBuffTarget(state, buff)) return state
      if (!isAbility(state, buff)) return state

      return createBuff(state, buff)
    },
  },
  "Avalanche (bonus)": {
    id: "Avalanche (bonus)",
    onTrigger: (state, buff) => {
      if (!isBuffTarget(state, buff)) return state
      if (!isAbility(state, buff)) return state
      if (!hasCondition(state, buff)) return state
      if (!isOnHitEvent(state)) return state

      return createBuff(state, buff)
    },
    onHit: (state, buff) => {
      return applyBuffStatChanges(state, buff)
    },
    onExpire: (state, buff) => {
      return removeBuffStatChanges(state, buff)
    },
  },
  Silversnow: {
    id: "Silversnow",
    onTrigger: (state, buff) => {
      if (!isAbility(state, buff)) return state

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
  "Ice Prism": {
    id: "Ice Prism",
    onTrigger: (state, buff) => {
      if (!isBuffTarget(state, buff)) return state
      if (!isAbility(state, buff)) return state
      if (!isOnHitEvent(state)) return state

      let newState = createBuff(state, buff)
      return addToBuffDeferred(newState, buff)
    },
  },
  "Ice Thorn": {
    id: "Ice Thorn",
    onTrigger: (state, buff) => {
      if (!isBuffTarget(state, buff)) return state
      if (!isAbility(state, buff)) return state
      if (!isOnHitEvent(state)) return state

      let newState = createBuff(state, buff)
      return addToBuffDeferred(newState, buff)
    },
  },
  "Ice Glacier": {
    id: "Ice Glacier",
    onTrigger: (state, buff) => {
      if (!isBuffTarget(state, buff)) return state
      if (!isAbility(state, buff)) return state
      if (!isOnHitEvent(state)) return state

      let newState = createBuff(state, buff)
      return addToBuffDeferred(newState, buff)
    },
  },
  Detonate: {
    id: "Detonate",
    onTrigger: (state, buff) => {
      if (!isBuffTarget(state, buff)) return state
      if (!isAbility(state, buff)) return state
      if (!isOnHitEvent(state)) return state

      return createBuff(state, buff)
    },
    onHit: (state, buff) => {
      const consumeById = ["Ice Prism", "Ice Thorn", "Ice Glacier"]
      const consumeByS6 = ["Ice Prism", "Ice Glacier"]

      let newState = addConsumeStacksToBuff(state, buff, consumeByS6)
      return resolveDamageProcs(newState, buff, consumeById)
    },
  },
  "Solitude's Embrace": {
    id: "Solitude's Embrace",
    onTrigger: (state, buff) => {
      if (!isBuffTarget(state, buff)) return state
      if (!isAbility(state, buff)) return state
      if (!isOnHitEvent(state)) return state

      return createBuff(state, buff)
    },
    onHit: (state, buff) => {
      return applyBuffStatChanges(state, buff)
    },
    onExpire: (state, buff) => {
      return removeBuffStatChanges(state, buff)
    },
  },
  "Blade Mastery": {
    id: "Blade Mastery",
    onTrigger: (state, buff) => {
      if (!isBuffTarget(state, buff)) return state
      if (!isAbility(state, buff)) return state

      return createBuff(state, buff)
    },
  },
  "Blade Mastery (energy)": {
    id: "Blade Mastery (energy)",
    onTrigger: (state, buff) => {
      if (!isBuffTarget(state, buff)) return state
      if (!isAbility(state, buff)) return state

      return createBuff(state, buff)
    },
    onHit: (state, buff) => {
      return applyResonanceFlat(state, buff)
    },
  },
  "Blade Mastery (bonus)": {
    id: "Blade Mastery (bonus)",
    onTrigger: (state, buff) => {
      if (!isBuffTarget(state, buff)) return state
      if (!isAbility(state, buff)) return state
      if (!hasCondition(state, buff)) return state

      return createBuff(state, buff)
    },
    onHit: (state, buff) => {
      return applyBuffStatChanges(state, buff)
    },
    onExpire: (state, buff) => {
      return removeBuffStatChanges(state, buff)
    },
  },
  "Unraveling Fate": {
    id: "Unraveling Fate",
    onTrigger: (state, buff) => {
      if (!isBuffTarget(state, buff)) return state
      if (!isAbility(state, buff)) return state

      return createBuff(state, buff)
    },
    onHit: (state, buff) => {
      return applyBuffStatChanges(state, buff)
    },
    onExpire: (state, buff) => {
      return removeBuffStatChanges(state, buff)
    },
  },
  "Daybreak Radiance": {
    id: "Daybreak Radiance",
    onTrigger: (state, buff) => {
      if (!isAbility(state, buff)) return state
      if (!isOnHitEvent(state)) return state
      if (isOnCooldown(state, buff)) return state

      return createGlobalBuff(state, buff)
    },
    onHit: (state, buff) => {
      const buffById = "Detonate"
      const stacksToAdd = getStacksFromBuff(state, buffById)
      if (!stacksToAdd) return state

      return applyGlobalStackingBuffStatChanges(state, buff, stacksToAdd)
    },
    onExpire: (state, buff) => {
      return removeGlobalStackingBuffStatChanges(state, buff)
    },
  },
}

export default sanhuaResolver
