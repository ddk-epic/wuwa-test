import { totalBuffMap } from "@/constants/maps"
import type { ActionListItem, Result } from "@/constants/types"
import calculate from "@/lib/calculations"
import { cn } from "@/lib/utils"

interface CalculateButtonProps {
  characters: (string | null)[]
  sequence: ActionListItem[]
  setResult: React.Dispatch<React.SetStateAction<Result[]>>
}

function CalculateButton({
  characters,
  sequence,
  setResult,
}: CalculateButtonProps) {
  return (
    <button
      onClick={() => {
        const result = calculate(characters, sequence, totalBuffMap)
        setResult(result)
      }}
      className={cn(
        "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold brightness-90 shadow-lg transition-all",
        sequence.length === 0
          ? "border border-border bg-secondary text-muted-foreground"
          : "border bg-primary text-primary-foreground hover:brightness-110",
      )}
      disabled={sequence.length === 0}
    >
      Calculate DPS
    </button>
  )
}

export default CalculateButton
