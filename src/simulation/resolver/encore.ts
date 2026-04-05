import type { BuffResolver } from "@/shared/types"
import {
  isBuffTarget,
  isAbility,
  createBuff,
  applyBuffStatChanges,
  isCategory,
  isOnHitEvent,
  applyStackingBuffStatChanges,
  isOnCooldown,
  applyResonanceFlat,
  isOnCastEvent,
  isBuffGlobal,
  createGlobalBuff,
  applyGlobalBuffStatChanges,
  hasCondition,
  removeStackingBuffStatChanges,
  removeBuffStatChanges,
  removeGlobalBuffStatChanges,
} from "../helper"

const encoreResolver: Record<string, BuffResolver> = {
  "Angry Cosmos": {
    id: "Angry Cosmos",
    onTrigger: (state, action, buff) => {
      if (!isBuffTarget(action, buff)) return state
      if (!isAbility(action, buff)) return state

      return createBuff(state, action, buff)
    },
    onCast: (state, action, buff) => {
      return applyBuffStatChanges(state, action, buff)
    },
    onExpire: (state, action, buff) => {
      return removeBuffStatChanges(state, action, buff)
    },
  },
  "Woolies Cheer Dance": {
    id: "Woolies Cheer Dance",
    onTrigger: (state, action, buff) => {
      if (!isBuffTarget(action, buff)) return state
      if (!isAbility(action, buff)) return state

      return createBuff(state, action, buff)
    },
    onCast: (state, action, buff) => {
      return applyBuffStatChanges(state, action, buff)
    },
    onExpire: (state, action, buff) => {
      return removeBuffStatChanges(state, action, buff)
    },
  },
  "Cosmos Rave": {
    id: "Cosmos Rave",
    onTrigger: (state, action, buff) => {
      if (!isBuffTarget(action, buff)) return state
      if (!isAbility(action, buff)) return state

      return createBuff(state, action, buff)
    },
  },
  "Wooly's Fairy Tale": {
    id: "Wooly's Fairy Tale",
    onTrigger: (state, action, buff) => {
      if (!isBuffTarget(action, buff)) return state
      if (!isCategory(action, buff)) return state
      if (!isOnHitEvent(action)) return state

      return createBuff(state, action, buff)
    },
    onHit: (state, action, buff) => {
      return applyStackingBuffStatChanges(state, action, buff)
    },
    onExpire: (state, action, buff) => {
      return removeStackingBuffStatChanges(state, action, buff)
    },
  },
  "Sheep-counting Lullaby": {
    id: "Sheep-counting Lullaby",
    onTrigger: (state, action, buff) => {
      if (!isBuffTarget(action, buff)) return state
      if (!isCategory(action, buff)) return state
      if (!isOnHitEvent(action)) return state
      if (isOnCooldown(state, buff)) return state

      return createBuff(state, action, buff)
    },
    onHit: (state, action, buff) => {
      return applyResonanceFlat(state, action, buff)
    },
  },
  "Fog? The Black Shores!": {
    id: "Fog? The Black Shores!",
    onTrigger: (state, action, buff) => {
      if (!isBuffTarget(action, buff)) return state
      if (!isAbility(action, buff)) return state
      if (!isOnCastEvent(action)) return state

      return createBuff(state, action, buff)
    },
    onCast: (state, action, buff) => {
      return applyBuffStatChanges(state, action, buff)
    },
    onExpire: (state, action, buff) => {
      return removeBuffStatChanges(state, action, buff)
    },
  },
  "Adventure? Let's go!": {
    id: "Adventure? Let's go!",
    onTrigger: (state, action, buff) => {
      if (!isBuffGlobal(buff)) return state
      if (!isAbility(action, buff)) return state

      return createGlobalBuff(state, action, buff)
    },
    onCast: (state, action, buff) => {
      return applyGlobalBuffStatChanges(state, action, buff)
    },

    onExpire: (state, action, buff) => {
      return removeGlobalBuffStatChanges(state, action, buff)
    },
  },
  "Hero Takes the Stage!": {
    id: "Hero Takes the Stage!",
    onTrigger: (state, action, buff) => {
      if (!isBuffTarget(action, buff)) return state

      return createBuff(state, action, buff)
    },
    onCast: (state, action, buff) => {
      return applyBuffStatChanges(state, action, buff)
    },
    onExpire: (state, action, buff) => {
      return removeBuffStatChanges(state, action, buff)
    },
  },
  "Woolies Save the World!": {
    id: "Woolies Save the World!",
    onTrigger: (state, action, buff) => {
      if (!isBuffTarget(action, buff)) return state
      if (!isOnHitEvent(action)) return state
      if (!hasCondition(state, action, buff)) return state

      return createBuff(state, action, buff)
    },
    onHit: (state, action, buff) => {
      return applyStackingBuffStatChanges(state, action, buff)
    },
    onExpire: (state, action, buff) => {
      return removeStackingBuffStatChanges(state, action, buff)
    },
  },
}

export default encoreResolver
