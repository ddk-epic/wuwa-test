import type { BuffResolver } from "@/shared/types"
import {
  addConsumeStacksToBuff,
  addToBuffDeferred,
  addToBuffNext,
  applyBuffStatChanges,
  applyDCondFlat,
  applyStackingBuffStatChanges,
  createBuff,
  createBuffNext,
  createDamageProcEvent,
  getStacksFromBuff,
  hasSwapped,
  isAbility,
  isAbilityWithCondition,
  isBuffTarget,
  isCategory,
  isOnHitEvent,
  removeBuffStatChanges,
  removeStackingBuffStatChanges,
} from "../../../simulation/helper"

const sanhuaResolver: Record<string, BuffResolver> = {
  Condensation: {
    id: "Condensation",
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
  Avalanche: {
    id: "Avalanche",
    triggerRules: [isBuffTarget, isAbility],
    onTrigger: (state, buff) => {
      return createBuff(state, buff)
    },
  },
  "Avalanche (bonus)": {
    id: "Avalanche (bonus)",
    triggerRules: [isBuffTarget, isAbilityWithCondition, isOnHitEvent],
    onTrigger: (state, buff) => {
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
    triggerRules: [isAbility],
    expireRules: [hasSwapped],
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
  "Ice Prism": {
    id: "Ice Prism",
    triggerRules: [isBuffTarget, isAbility, isOnHitEvent],
    onTrigger: (state, buff) => {
      let newState = createBuff(state, buff)
      return addToBuffDeferred(newState, buff)
    },
  },
  "Ice Thorn": {
    id: "Ice Thorn",
    triggerRules: [isBuffTarget, isAbility, isOnHitEvent],
    onTrigger: (state, buff) => {
      let newState = createBuff(state, buff)
      return addToBuffDeferred(newState, buff)
    },
  },
  "Ice Glacier": {
    id: "Ice Glacier",
    triggerRules: [isBuffTarget, isAbility, isOnHitEvent],
    onTrigger: (state, buff) => {
      let newState = createBuff(state, buff)
      return addToBuffDeferred(newState, buff)
    },
  },
  Detonate: {
    id: "Detonate",
    triggerRules: [isBuffTarget, isAbility, isOnHitEvent],
    onTrigger: (state, buff) => {
      return createBuff(state, buff)
    },
    onHit: (state, buff) => {
      const consumeById = ["Ice Prism", "Ice Thorn", "Ice Glacier"]
      const consumeByS6 = ["Ice Prism", "Ice Glacier"]

      let newState = addConsumeStacksToBuff(state, buff, consumeByS6)
      return createDamageProcEvent(newState, buff, consumeById)
    },
  },
  "Solitude's Embrace": {
    id: "Solitude's Embrace",
    triggerRules: [isBuffTarget, isAbility, isOnHitEvent],
    onTrigger: (state, buff) => {
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
    triggerRules: [isBuffTarget, isAbility],
    onTrigger: (state, buff) => {
      return createBuff(state, buff)
    },
  },
  "Blade Mastery (energy)": {
    id: "Blade Mastery (energy)",
    triggerRules: [isBuffTarget, isAbility],
    onTrigger: (state, buff) => {
      return createBuff(state, buff)
    },
    onHit: (state, buff) => {
      return applyDCondFlat(state, buff)
    },
  },
  "Blade Mastery (bonus)": {
    id: "Blade Mastery (bonus)",
    triggerRules: [isBuffTarget, isAbilityWithCondition],
    onTrigger: (state, buff) => {
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
    triggerRules: [isBuffTarget, isAbility],
    onTrigger: (state, buff) => {
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
    triggerRules: [isAbility, isOnHitEvent],
    onTrigger: (state, buff) => {
      return createBuff(state, buff)
    },
    onHit: (state, buff) => {
      const buffById = "Detonate"
      const stacksToAdd = getStacksFromBuff(state, buffById)
      if (!stacksToAdd) return state

      return applyStackingBuffStatChanges(state, buff, stacksToAdd)
    },
    onExpire: (state, buff) => {
      return removeStackingBuffStatChanges(state, buff)
    },
  },
}

export default sanhuaResolver
