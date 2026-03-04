import { X } from "lucide-react"
import { cn } from "@/lib/utils"

import type { ActionListItem } from "@/constants/types"
import team from "@/constants/characters"
import { ELEMENT_COLORS } from "@/constants/colors"

interface SequenceEntryProps {
  entry: ActionListItem
  index: number
  onRemove: () => void
}

function SequenceEntry({ entry, index, onRemove }: SequenceEntryProps) {
  const element = team[entry.char].element
  const skill = entry.skill

  return (
    <div className="group flex items-center gap-2 rounded-md border bg-secondary/70 px-3 py-1.5 transition-colors hover:border-primary/30">
      <span className="w-4 text-right text-xs font-mono text-muted-foreground">
        {index + 1}
      </span>
      <span
        className={cn(
          "w-18 font-mono text-xs uppercase",
          ELEMENT_COLORS[element].text ?? "",
        )}
      >
        {entry.char}
      </span>
      <span className="rounded px-1.5 py-0.5 text-xs font-mono font-semibold uppercase tracking-wider">
        {skill.category.slice(0, 5)}
      </span>
      <span className="min-w-40 text-sm text-foreground">{skill.name}</span>
      <span className="ml-auto text-xs font-mono">
        {entry.time.toFixed(2)}
      </span>
      <button
        onClick={onRemove}
        className="ml-0.5 rounded text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export default SequenceEntry
