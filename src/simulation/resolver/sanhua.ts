import type { BuffResolver } from "@/shared/types"
import {
  isBuffTarget,
  createBuff,
  applyBuff,
  isCategory,
  hasCondition,
  isAbility,
  isOnHitEvent,
  createBuffNext,
  addToBuffNext,
  removeBuffStatChanges,
  addToBuffDeferred,
  resolveDamageProcs,
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
      return applyBuff(state, action, buff)
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
    onCast: (state, action, buff) => {
      return applyBuff(state, action, buff)
    },
  },
  Silversnow: {
    id: "Silversnow",
    onTrigger: (state, action, buff) => {
      if (!isAbility(action, buff)) return state

      return addToBuffNext(state, buff)
    },
    onCast: (state, action, buff) => {
      return applyBuff(state, action, buff)
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

      return resolveDamageProcs(state, action, buff, consumeById)
    },
  },
}

export default sanhuaResolver
