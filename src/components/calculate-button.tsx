import { cn } from "@/lib/utils"

import type { ActionListItem, Character, Skill } from "@/constants/types"
import type { CHARACTER_KEY } from "@/constants/characters"

interface CalculateButtonProps {
  charData: Record<Exclude<CHARACTER_KEY, "__none__">, Character>
  skillData: Record<CHARACTER_KEY, Record<string, Skill[]>>
  sequence: ActionListItem[]
  handleCalculate: (
    characters: Record<Exclude<CHARACTER_KEY, "__none__">, Character>,
    skillList: Record<CHARACTER_KEY, Record<string, Skill[]>>,
    actionList: ActionListItem[],
  ) => void
}

function CalculateButton({
  charData,
  skillData,
  sequence,
  handleCalculate,
}: CalculateButtonProps) {
  return (
    <button
      onClick={() => handleCalculate(charData, skillData, sequence)}
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
