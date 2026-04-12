import type { BuffResolver } from "@/shared/types"
import {
  addToBuffNext,
  applyGlobalBuffStatChanges,
  createEnemyDebuff,
  createGlobalBuff,
  createGlobalBuffNext,
  isAbility,
  isCategory,
  isOnCastEvent,
  or,
  removeGlobalBuffStatChanges,
} from "@/simulation/helper"

const verinaResolver: Record<string, BuffResolver> = {
  "Gift of Nature": {
    id: "Gift of Nature",
    triggerRules: [or(isAbility, isCategory)],
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
}

export default verinaResolver
