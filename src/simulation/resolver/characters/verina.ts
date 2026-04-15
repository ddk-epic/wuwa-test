import type { BuffResolver } from "@/shared/types"
import {
  addToBuffNext,
  applyGlobalBuffStatChanges,
  createCoordProcEvent,
  createEnemyDebuff,
  createGlobalBuff,
  createGlobalBuffNext,
  getEnemyBuffById,
  hasDebuff,
  isAbility,
  isOnCastEvent,
  isOnCooldown,
  isOnHitEvent,
  not,
  removeGlobalBuffStatChanges,
} from "@/simulation/helper"

const verinaResolver: Record<string, BuffResolver> = {
  "Gift of Nature": {
    id: "Gift of Nature",
    triggerRules: [isAbility],
    onTrigger: (state, buff) => {
      return createGlobalBuff(state, buff)
    },
    onCast: (state, buff) => {
      return applyGlobalBuffStatChanges(state, buff)
    },
    onExpire: (state, buff) => {
      return removeGlobalBuffStatChanges(state, buff)
    },
  },
  Blossom: {
    id: "Blossom",
    triggerRules: [isAbility, isOnCastEvent],
    onTrigger: (state, buff) => {
      return addToBuffNext(state, buff)
    },
    onCast: (state, buff) => {
      return applyGlobalBuffStatChanges(state, buff)
    },
    onSwap: (state, buff) => {
      return createGlobalBuffNext(state, buff)
    },
    onExpire: (state, buff) => {
      return removeGlobalBuffStatChanges(state, buff)
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
    triggerRules: [hasDebuff, isOnHitEvent, not(isOnCooldown)],
    onTrigger: (state, buff) => {
      const buffId = "Photosynthesis Mark"
      const parentId = getEnemyBuffById(state, buffId)?.sourceEventId
      return createCoordProcEvent(state, buff, parentId)
    },
  },
}

export default verinaResolver
