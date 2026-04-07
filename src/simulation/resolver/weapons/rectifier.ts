import type { BuffResolver } from "@/shared/types"
import {
  isBuffTarget,
  createBuff,
  applyBuffStatChanges,
  removeBuffStatChanges,
  isCategory,
  applyStackingBuffStatChanges,
  removeStackingBuffStatChanges,
  isOnField,
  getStacksFromBuff,
} from "@/simulation/helper"

const rectifierResolver: Record<string, BuffResolver> = {
  "Stringmaster (Ele)": {
    id: "Stringmaster (Ele)",
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
  "Stringmaster (Atk)": {
    id: "Stringmaster (Atk)",
    onTrigger: (state, buff) => {
      if (!isBuffTarget(state, buff)) return state
      if (!isCategory(state, buff)) return state

      return createBuff(state, buff)
    },
    onHit: (state, buff) => {
      return applyStackingBuffStatChanges(state, buff)
    },
    onExpire: (state, buff) => {
      return removeStackingBuffStatChanges(state, buff)
    },
  },
  "Stringmaster (Off-field)": {
    id: "Stringmaster (Off-field)",
    onTrigger: (state, buff) => {
      if (!isBuffTarget(state, buff)) return state
      if (!isCategory(state, buff)) return state
      if (isOnField(state)) return state

      return createBuff(state, buff)
    },
    onHit: (state, buff) => {
      const buffById = "Stringmaster (Atk)"
      const stacksToAdd = getStacksFromBuff(state, buffById)
      return applyStackingBuffStatChanges(state, buff, stacksToAdd)
    },
    onExpire: (state, buff) => {
      return removeStackingBuffStatChanges(state, buff)
    },
  },
  // "Stellar Symphony": {
  //   id: "Stellar Symphony",
  //   onTrigger: (state, buff) => {
  //     return state
  //   },
  // },
}

export default rectifierResolver
