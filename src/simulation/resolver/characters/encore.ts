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
} from "../../helper"

const encoreResolver: Record<string, BuffResolver> = {
  "Angry Cosmos": {
    id: "Angry Cosmos",
    onTrigger: (state, buff) => {
      if (!isBuffTarget(state, buff)) return state
      if (!isAbility(state, buff)) return state

      return createBuff(state, buff)
    },
    onCast: (state, buff) => {
      return applyBuffStatChanges(state, buff)
    },
    onExpire: (state, buff) => {
      return removeBuffStatChanges(state, buff)
    },
  },
  "Woolies Cheer Dance": {
    id: "Woolies Cheer Dance",
    onTrigger: (state, buff) => {
      if (!isBuffTarget(state, buff)) return state
      if (!isAbility(state, buff)) return state

      return createBuff(state, buff)
    },
    onCast: (state, buff) => {
      return applyBuffStatChanges(state, buff)
    },
    onExpire: (state, buff) => {
      return removeBuffStatChanges(state, buff)
    },
  },
  "Cosmos Rave": {
    id: "Cosmos Rave",
    onTrigger: (state, buff) => {
      if (!isBuffTarget(state, buff)) return state
      if (!isAbility(state, buff)) return state

      return createBuff(state, buff)
    },
  },
  "Wooly's Fairy Tale": {
    id: "Wooly's Fairy Tale",
    onTrigger: (state, buff) => {
      if (!isBuffTarget(state, buff)) return state
      if (!isCategory(state, buff)) return state
      if (!isOnHitEvent(state)) return state

      return createBuff(state, buff)
    },
    onHit: (state, buff) => {
      return applyStackingBuffStatChanges(state, buff)
    },
    onExpire: (state, buff) => {
      return removeStackingBuffStatChanges(state, buff)
    },
  },
  "Sheep-counting Lullaby": {
    id: "Sheep-counting Lullaby",
    onTrigger: (state, buff) => {
      if (!isBuffTarget(state, buff)) return state
      if (!isCategory(state, buff)) return state
      if (!isOnHitEvent(state)) return state
      if (isOnCooldown(state, buff)) return state

      return createBuff(state, buff)
    },
    onHit: (state, buff) => {
      return applyResonanceFlat(state, buff)
    },
  },
  "Fog? The Black Shores!": {
    id: "Fog? The Black Shores!",
    onTrigger: (state, buff) => {
      if (!isBuffTarget(state, buff)) return state
      if (!isAbility(state, buff)) return state
      if (!isOnCastEvent(state)) return state

      return createBuff(state, buff)
    },
    onCast: (state, buff) => {
      return applyBuffStatChanges(state, buff)
    },
    onExpire: (state, buff) => {
      return removeBuffStatChanges(state, buff)
    },
  },
  "Adventure? Let's go!": {
    id: "Adventure? Let's go!",
    onTrigger: (state, buff) => {
      if (!isBuffGlobal(buff)) return state
      if (!isAbility(state, buff)) return state

      return createGlobalBuff(state, buff)
    },
    onCast: (state, buff) => {
      return applyGlobalBuffStatChanges(state, buff)
    },

    onExpire: (state, buff) => {
      return removeGlobalBuffStatChanges(state, buff)
    },
  },
  "Hero Takes the Stage!": {
    id: "Hero Takes the Stage!",
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
  "Woolies Save the World!": {
    id: "Woolies Save the World!",
    onTrigger: (state, buff) => {
      if (!isBuffTarget(state, buff)) return state
      if (!isOnHitEvent(state)) return state
      if (!hasCondition(state, buff)) return state

      return createBuff(state, buff)
    },
    onHit: (state, buff) => {
      return applyStackingBuffStatChanges(state, buff)
    },
    onExpire: (state, buff) => {
      return removeStackingBuffStatChanges(state, buff)
    },
  },
}

export default encoreResolver
