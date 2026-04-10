import type { BuffResolver } from "@/shared/types"
import {
  isBuffTarget,
  isAbility,
  createBuff,
  applyBuffStatChanges,
  removeBuffStatChanges,
} from "@/simulation/helper"

const fusionEchoResolver: Record<string, BuffResolver> = {
  "Inferno Rider (Fusion/Basic)": {
    id: "Inferno Rider (Fusion/Basic)",
    triggerRules: [isBuffTarget, isAbility],
    onTrigger: (state, buff) => {
      // TODO: trigger on [hit 3]
      return createBuff(state, buff)
    },
    onHit: (state, buff) => {
      return applyBuffStatChanges(state, buff)
    },
    onExpire: (state, buff) => {
      return removeBuffStatChanges(state, buff)
    },
  },
}

export default fusionEchoResolver
