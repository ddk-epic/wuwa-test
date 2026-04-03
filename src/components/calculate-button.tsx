import { cn } from "@/lib/utils"

import type { Character, TimelineEvent } from "@/shared/types"

interface CalculateButtonProps {
  characterData: Character[]
  sequence: TimelineEvent[]
  handleCalculate: (
    characters: Character[],
    actionList: TimelineEvent[],
  ) => void
}

function CalculateButton({
  characterData,
  sequence,
  handleCalculate,
}: CalculateButtonProps) {
  return (
    <button
      onClick={() => handleCalculate(characterData, sequence)}
      className={cn(
        "flex items-center gap-2 rounded-lg px-4 py-2.5 z-10 text-sm font-semibold brightness-90 shadow-lg transition-all",
        sequence.length === 0
          ? "border border-border bg-secondary text-muted-foreground"
          : "border bg-primary text-primary-foreground hover:brightness-110",
      )}
      disabled={sequence.length === 0}
    >
      Calculate
    </button>
  )
}

export default CalculateButton
