import { X } from "lucide-react"

import { cn, frameToSecond } from "@/lib/utils"

import { Button } from "./ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"

import type { ActionListItem, Result } from "@/shared/types"
import characterTemplate from "@/definitions/characters"
import { COLORS, ELEMENT_COLORS } from "@/definitions/colors"

interface SequenceListProps {
  sequence: ActionListItem[]
  result: Result[]
  onRemoveSkill: (i: number) => void
}

function SequenceList({ sequence, result, onRemoveSkill }: SequenceListProps) {
  return (
    <Table className="table-fixed w-full">
      {/* Sequence header */}
      <TableHeader className="top-0 sticky z-10 border bg-card">
        <TableRow>
          <TableHead className="w-1/24 px-2 py-2 text-right text-xs column-header">
            #
          </TableHead>
          <TableHead className="w-3/24 px-2 py-2 text-xs column-header">
            Character
          </TableHead>
          <TableHead className="w-2/24 px-2 py-2 text-xs column-header">
            {/* Category */}
          </TableHead>
          <TableHead className="w-7/24 pr-3 py-2 text-start text-xs column-header">
            Ability
          </TableHead>
          <TableHead className="w-2/24 px-2 py-2 text-right text-xs column-header">
            Time
          </TableHead>
          <TableHead className="w-2/24 px-2 py-2 text-right text-xs column-header">
            Con.
          </TableHead>
          <TableHead className="w-2/24 px-2 py-2 text-right text-xs column-header">
            Res.
          </TableHead>
          <TableHead className="w-3/24 px-1 py-2 text-right text-xs column-header">
            Damage
          </TableHead>
          <TableHead className="w-2/24 px-2 py-2 text-right text-xs column-header">
            {/* Proc */}
          </TableHead>
          <TableHead className="w-4 px-3 py-2 text-xs column-header">
            {/* Button */}
          </TableHead>
        </TableRow>
      </TableHeader>
      {/* Sequence list */}
      <TableBody>
        {sequence.map((action, i) => {
          const placeholder = "--"
          const { characterId, skill, time } = action
          const character = characterTemplate[characterId]

          const element = character.element
          const elementColorText = ELEMENT_COLORS[element].text
          const healColorText = COLORS["heal"].text
          const shieldColorText = COLORS["shield"].text

          const row = result[i]

          const warning = row?.message?.warning

          return (
            <>
              <TableRow
                key={i}
                className={cn(
                  "group",
                  i % 2 === 0 ? "bg-secondary/90" : "bg-secondary/70",
                )}
              >
                <TableCell className="px-1 font-mono text-right">
                  {i + 1}
                </TableCell>
                <TableCell
                  className={cn(
                    "px-2 font-mono uppercase tracking-wide",
                    elementColorText,
                  )}
                >
                  {characterId}
                </TableCell>
                <TableCell className="text-[13px] text-right font-mono text-muted-foreground font-semibold uppercase tracking-wider">
                  {skill.category.slice(0, 5)}
                </TableCell>
                <TableCell
                  className={cn(
                    "pr-3 text-start text-sm text-foreground truncate",
                    skill.category === "liberation" && elementColorText,
                  )}
                >
                  {skill.name}
                </TableCell>
                <TableCell className="px-2 font-mono text-right">
                  {frameToSecond(time)}
                </TableCell>
                <TableCell className="px-2 font-mono text-right">
                  {!!row ? row.concerto.toFixed(1) : placeholder}
                </TableCell>
                <TableCell className="px-2 font-mono text-right">
                  {!!row ? row.resonance.toFixed(1) : placeholder}
                </TableCell>
                <TableCell
                  className={cn(
                    "px-2 text-right text-sm",
                    !!row && row.damage > 0 && elementColorText,
                  )}
                >
                  {!!row && row.damage > 0
                    ? Math.round(row.damage).toLocaleString("en-US")
                    : placeholder}
                </TableCell>
                <TableCell className="px-2 font-mono text-right">
                  {!!row && row.proc.heal > 0 && (
                    <p className={healColorText}>
                      {Math.round(row.proc.heal).toLocaleString("en-US")}
                    </p>
                  )}
                  {!!row && row.proc.shield > 0 && (
                    <p className={shieldColorText}>
                      {Math.round(row.proc.shield).toLocaleString("en-US")}
                    </p>
                  )}
                  {!!row && row.proc.heal <= 0 && row.proc.shield <= 0 && (
                    <p>{placeholder}</p>
                  )}
                </TableCell>
                <TableCell className="w-4 p-0 pr-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveSkill(i)}
                    className="size-6 text-muted-foreground opacity-0 transition-opacity hover:bg-secondary/90 hover:text-destructive group-hover:opacity-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
              {warning &&
                warning.size > 0 &&
                [...warning.values()].map((warning) => (
                  <TableRow>
                    <TableCell colSpan={10} className="py-0 bg-red-700/70">
                      {warning}
                    </TableCell>
                  </TableRow>
                ))}
            </>
          )
        })}
      </TableBody>
    </Table>
  )
}

export default SequenceList
