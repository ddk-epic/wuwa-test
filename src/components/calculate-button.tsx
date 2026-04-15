import { cn } from "@/lib/utils"

import type { Character, TimelineEvent } from "@/shared/types"

interface CalculateButtonProps {
  characterData: Character[]
  timeline: TimelineEvent[]
  handleCalculate: (
    characters: Character[],
    actionList: TimelineEvent[],
  ) => void
}

function CalculateButton({
  characterData,
  timeline,
  handleCalculate,
}: CalculateButtonProps) {
  return (
    <button
      onClick={() => handleCalculate(characterData, timeline)}
      className={cn(
        "flex items-center gap-2 rounded-lg px-4 py-2.5 z-10 text-sm font-semibold brightness-90 shadow-lg transition-all",
        timeline.length === 0
          ? "border border-border bg-secondary text-muted-foreground"
          : "border bg-primary text-primary-foreground hover:brightness-110",
      )}
      disabled={timeline.length === 0}
    >
      Calculate
    </button>
  )
}

export default CalculateButton
