import { X } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "./ui/button"
import { TableCell, TableRow } from "./ui/table"
import Hint from "./hint"

import type { ActionListItem, Result } from "@/constants/types"
import characterTemplate from "@/constants/characters"
import { ELEMENT_COLORS } from "@/constants/colors"

interface SequenceEntryProps {
  index: number
  entry: ActionListItem
  res: Result[]
  onRemove: () => void
}

function SequenceEntry({ index, entry, res, onRemove }: SequenceEntryProps) {
  const placeholder = "--"
  const skill = entry.skill
  const element = characterTemplate[entry.char].element
  const result = res[index]

  const activeBuffString =
    result?.buffs?.map((buff) => buff.name).join(", ") ?? ""
  const finalBuffMap = (() => {
    let idx = 0
    return [6, 5, 5, 6, 5]
      .map((size) => {
        const group = result?.buffMap?.slice(idx, idx + size) ?? []
        idx += size
        return `[${group.join(" ")}]`
      })
      .join(" ")
  })()

  return (
    <TableRow
      key={index}
      className={cn(
        "group w-full",
        index % 2 === 0 ? "bg-secondary/90" : "bg-secondary/70",
      )}
    >
      <TableCell className="px-3 text-xs font-mono text-muted-foreground text-right">
        {index + 1}
      </TableCell>
      <TableCell
        className={cn(
          "px-3 w-18 font-mono text-xs uppercase tracking-wide",
          ELEMENT_COLORS[element].text ?? "",
        )}
      >
        {entry.char}
      </TableCell>
      <TableCell className="w-5 pl-3 text-[13px] text-right font-mono text-muted-foreground font-semibold uppercase tracking-wider">
        {skill.category.slice(0, 5)}
      </TableCell>
      <TableCell
        className={cn(
          "pr-3 max-w-32 text-start text-sm text-foreground truncate",
          skill.category === "liberation" ? ELEMENT_COLORS[element]?.text : "",
        )}
      >
        {skill.name}
      </TableCell>
      <TableCell className="px-3 text-xs font-mono text-right">
        {entry.time.toFixed(2)}
      </TableCell>
      <TableCell className="px-3 w-8 text-xs font-mono text-right">
        {!!result ? result.concerto.toFixed(1) : placeholder}
      </TableCell>
      <TableCell className="px-3 w-14 text-xs font-mono text-right">
        {!!result ? result.resonance.toFixed(1) : placeholder}
      </TableCell>
      <TableCell
        className={cn(
          "px-3 w-10 text-right text-sm",
          !!result && result.damage !== 0 ? ELEMENT_COLORS[element].text : "",
        )}
      >
        {!!result && result.damage !== 0
          ? Math.round(result.damage).toLocaleString("en-US") : placeholder}
      </TableCell>
      <TableCell className="px-3 w-10 text-xs font-mono text-right">
        {!!result ? Math.round(result.procc.damage) : placeholder}
      </TableCell>
      <TableCell className="max-w-32 grow text-xs truncate">
        {!!result && (
          <Hint label={activeBuffString}>
            <span>
              ({result.buffs?.length || 0}) [{activeBuffString}]
            </span>
          </Hint>
        )}
      </TableCell>
      <TableCell className="max-w-32 text-xs truncate">
        {!!result && (
          <Hint label={finalBuffMap}>
            <span>{finalBuffMap}</span>
          </Hint>
        )}
      </TableCell>
      <TableCell className="w-4 p-0 pr-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="size-6 text-muted-foreground opacity-0 transition-opacity hover:bg-secondary/90 hover:text-destructive group-hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  )
}

export default SequenceEntry
