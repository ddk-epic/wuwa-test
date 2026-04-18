import type { BuffResolver } from "@/shared/types"
import {
  addToBuffNext,
  applyBuffStatChanges,
  createBuff,
  createBuffNext,
  createCoordProcEvent,
  createEnemyDebuff,
  getEnemyBuffById,
  enemyCondition,
  isAbility,
  isOnCastEvent,
  isOnCooldown,
  isOnHitEvent,
  not,
  removeBuffStatChanges,
} from "@/simulation/helper"

const verinaResolver: Record<string, BuffResolver> = {
  "Gift of Nature": {
    id: "Gift of Nature",
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
  Blossom: {
    id: "Blossom",
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
  "Photosynthesis Mark": {
    id: "Photosynthesis Mark",
    triggerRules: [isAbility],
    onTrigger: (state, buff) => {
      return createEnemyDebuff(state, buff)
    },
  },
  "Arboreal Flourish (Coord)": {
    id: "Arboreal Flourish (Coord)",
    triggerRules: [enemyCondition, isOnHitEvent, not(isOnCooldown)],
    onTrigger: (state, buff) => {
      const buffId = "Photosynthesis Mark"
      const parentId = getEnemyBuffById(state, buffId)?.sourceEventId
      return createCoordProcEvent(state, buff, parentId)
    },
  },
}

export default verinaResolver
