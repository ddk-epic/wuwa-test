import type { BuffResolver } from "@/shared/types"
import {
  addToBuffNext,
  applyGlobalBuffStatChanges,
  createGlobalBuffNext,
  isAbility,
  removeGlobalBuffStatChanges,
} from "@/simulation/helper"

const verinaResolver: Record<string, BuffResolver> = {
  Blossom: {
    id: "Blossom",
    triggerRules: [isAbility],
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
}

export default verinaResolver
