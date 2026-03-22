import { X } from "lucide-react"
import { cn, frameToSecond } from "@/lib/utils"

import { Button } from "./ui/button"
import { TableCell, TableRow } from "./ui/table"

import type { ActionListItem, Result } from "@/constants/types"
import { ELEMENT_COLORS } from "@/constants/colors"
import characterTemplate from "@/constants/characters"

interface SequenceEntryProps {
  index: number
  entry: ActionListItem
  res: Result[]
  onRemove: () => void
}

function SequenceEntry({ index, entry, res, onRemove }: SequenceEntryProps) {
  const placeholder = "--"
  const skill = entry.skill
  const character = characterTemplate[entry.characterId]
  const element = character.element
  const elementColorText = ELEMENT_COLORS[element].text
  const result = res[index]

  return (
    <TableRow
      key={index}
      className={cn(
        "group",
        index % 2 === 0 ? "bg-secondary/90" : "bg-secondary/70",
      )}
    >
      <TableCell className="px-1 font-mono text-right">
        {index + 1}
      </TableCell>
      <TableCell
        className={cn(
          "px-2 font-mono uppercase tracking-wide",
          elementColorText,
        )}
      >
        {entry.characterId}
      </TableCell>
      <TableCell className="text-[13px] text-right font-mono text-muted-foreground font-semibold uppercase tracking-wider">
        {skill.category.slice(0, 5)}
      </TableCell>
      <TableCell
        className={cn(
          "pr-3 text-start text-sm text-foreground truncate",
          skill.category === "liberation" ? elementColorText : "",
        )}
      >
        {skill.name}
      </TableCell>
      <TableCell className="px-2 font-mono text-right">
        {frameToSecond(entry.time)}
      </TableCell>
      <TableCell className="px-2 font-mono text-right">
        {!!result ? result.concerto.toFixed(1) : placeholder}
      </TableCell>
      <TableCell className="px-2 font-mono text-right">
        {!!result ? result.resonance.toFixed(1) : placeholder}
      </TableCell>
      <TableCell
        className={cn(
          "px-2 text-right text-sm",
          !!result && result.damage !== 0 ? elementColorText : "",
        )}
      >
        {!!result && result.damage !== 0
          ? Math.round(result.damage).toLocaleString("en-US")
          : placeholder}
      </TableCell>
      <TableCell className="px-2 font-mono text-right">
        {!!result ? Math.round(result.proc.damage) : placeholder}
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
