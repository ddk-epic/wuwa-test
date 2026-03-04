import { cn } from "@/lib/utils"

import Hint from "./hint"

import type { Result } from "@/constants/types"
import { ELEMENT_COLORS } from "@/constants/colors"
import team from "@/constants/characters"

interface ResultEntryProps {
  entry: Result
  index: number
}

function ResultEntry({ entry }: ResultEntryProps) {
  const character = team[entry.char]
  const element = character.element

  const activeBuffArray = entry.buffs?.map((buff) => buff.name).join(", ") ?? ""
  const totalBuffMap = (() => {
    let idx = 0
    return [6, 5, 5, 6, 5]
      .map((size) => {
        const group = entry?.buffMap.slice(idx, idx + size)
        idx += size
        return `[${group.join(" ")}]`
      })
      .join(" ")
  })()

  return (
    <div className="group flex items-center gap-4 rounded-md border bg-secondary/70 px-3 py-1.5 transition-colors hover:border-primary/30">
      <span className="w-8 ml-4 text-right text-xs font-mono">
        {entry.concerto.toFixed(1)}
      </span>
      <span className="w-14 mr-4 text-right text-xs font-mono">
        {entry.resonance.toFixed(1)}
      </span>
      <span
        className={cn(
          "w-10 text-right text-sm text-foreground",
          ELEMENT_COLORS[element].text ?? "",
        )}
      >
        {Math.round(entry.damage).toLocaleString("en-US")}
      </span>
      <span className="w-10 mr-4 text-right text-xs font-mono">
        {Math.round(entry.procc.damage)}
      </span>
      <Hint label={activeBuffArray}>
        <span className="w-32 text-xs truncate">
          ({entry.buffs?.length ?? 0}) [{activeBuffArray}]
        </span>
      </Hint>
      <Hint label={totalBuffMap}>
        <span className="w-32 text-xs truncate" title={totalBuffMap}>
          {totalBuffMap}
        </span>
      </Hint>
    </div>
  )
}

export default ResultEntry
