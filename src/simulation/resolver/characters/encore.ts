import type { BuffResolver } from "@/shared/types"
import {
  applyBuffStatChanges,
  applyDCondFlat,
  applyStackingBuffStatChanges,
  createBuff,
  hasCondition,
  isAbility,
  isBuffGlobal,
  isBuffTarget,
  isCategory,
  isOnCastEvent,
  isOnCooldown,
  isOnHitEvent,
  not,
  removeBuffStatChanges,
  removeStackingBuffStatChanges,
} from "../../helper"

const encoreResolver: Record<string, BuffResolver> = {
  "Angry Cosmos": {
    id: "Angry Cosmos",
    triggerRules: [isBuffTarget, isAbility],
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
  "Woolies Cheer Dance": {
    id: "Woolies Cheer Dance",
    triggerRules: [isBuffTarget, isAbility],
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
  "Cosmos Rave": {
    id: "Cosmos Rave",
    triggerRules: [isBuffTarget, isAbility],
    onTrigger: (state, buff) => {
      return createBuff(state, buff)
    },
  },
  "Wooly's Fairy Tale": {
    id: "Wooly's Fairy Tale",
    triggerRules: [isBuffTarget, isCategory, isOnHitEvent],
    onTrigger: (state, buff) => {
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
    triggerRules: [isBuffTarget, isCategory, isOnHitEvent, not(isOnCooldown)],
    onTrigger: (state, buff) => {
      return createBuff(state, buff)
    },
    onHit: (state, buff) => {
      return applyDCondFlat(state, buff)
    },
  },
  "Fog? The Black Shores!": {
    id: "Fog? The Black Shores!",
    triggerRules: [isBuffTarget, isAbility, isOnCastEvent],
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
  "Adventure? Let's go!": {
    id: "Adventure? Let's go!",
    triggerRules: [isBuffGlobal, isAbility],
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
  "Hero Takes the Stage!": {
    id: "Hero Takes the Stage!",
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
  "Woolies Save the World!": {
    id: "Woolies Save the World!",
    triggerRules: [isBuffTarget, isOnHitEvent, hasCondition],
    onTrigger: (state, buff) => {
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
