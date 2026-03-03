import { cn } from "@/lib/utils"

import type { Result } from "@/constants/types"
import team from "@/constants/characters"
import { ELEMENT_COLORS } from "@/constants/colors"

interface ResultEntryProps {
  entry: Result
  index: number
}

function ResultEntry({ entry, index }: ResultEntryProps) {
  const element = team[entry.char].element

  return (
    <div className="group flex items-center gap-2 rounded-md border bg-secondary/70 px-3 py-1.5 transition-colors hover:border-primary/30">
      <span className="w-4 text-right text-[12px] font-mono text-muted-foreground">{index + 1}</span>
      <span className="w-10 font-mono text-[12px] uppercase">{element}</span>
      <span
        className={cn(
          "text-sm text-foreground",
          ELEMENT_COLORS[element].text ?? "",
        )}
      >
        {Math.round(entry.damage)}
      </span>
      <span className="ml-auto text-xs font-mono">
        {/* {entry.time.toFixed(2)} */}
      </span>
    </div>
  )
}

export default ResultEntry
