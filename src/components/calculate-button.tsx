import { cn } from "@/lib/utils"

import type { ActionListItem, Character } from "@/constants/types"
import type { CHARACTER_KEY } from "@/constants/characters"

interface CalculateButtonProps {
  charData: Record<CHARACTER_KEY, Character>
  sequence: ActionListItem[]
  handleCalculate: (characters: Record<CHARACTER_KEY, Character>, actionList: ActionListItem[]) => void
}

function CalculateButton({
  charData,
  sequence,
  handleCalculate,
}: CalculateButtonProps) {
  return (
    <button
      onClick={() => handleCalculate(charData, sequence)}
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
