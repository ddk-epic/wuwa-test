import { cn, frameToSecond, getStatCellColor, toPercent } from "@/lib/utils"

import { Table, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"

import { ELEMENT_COLORS, STAT_COLORS } from "@/constants/colors"
import type { BUFF_TYPE, Result } from "@/constants/types"
import characterTemplate, { type CHARACTER_KEY } from "@/constants/characters"

interface CalculationLogProps {
  resultTimeline: Result[]
}

function CalculationLog({ resultTimeline }: CalculationLogProps) {
  const statListLength = 33
  const statKeys = Object.keys(STAT_COLORS).slice(0, statListLength)

  if (!resultTimeline) return null
  return (
    <Table className="w-full border-separate border-spacing-0">
      <TableHeader>
        {/* Table group headers */}
        <TableRow>
          <TableHead
            colSpan={5}
            className="sticky left-0 top-0 z-30 column-header py-1 bg-card border-b border-card text-center shadow-[inset_0_-1px_0_rgb(39,39,42)]"
          >
            Entry
          </TableHead>
          <TableHead
            colSpan={4}
            className="sticky left-0 top-0 z-20 column-header py-1 bg-zinc-800 text-center shadow-[inset_0_-1px_0_rgb(39,39,42)]"
          >
            Result
          </TableHead>
          <TableHead
            colSpan={2}
            className="sticky left-0 top-0 z-20 column-header py-1 bg-card text-center shadow-[inset_0_-1px_0_rgb(39,39,42)]"
          >
            Buffs
          </TableHead>
          <TableHead
            colSpan={6}
            style={getStatCellColor("atk", 0)}
            className="sticky left-0 top-0 z-20 column-header py-1 bg-zinc-800/50 text-center"
          >
            Final Stats
          </TableHead>
          <TableHead
            colSpan={5}
            className="sticky left-0 top-0 z-20 column-header py-1 bg-zinc-800/50 text-center"
          >
            Damage Bonuses
          </TableHead>
          <TableHead
            colSpan={6}
            style={getStatCellColor("aero", 0)}
            className="sticky left-0 top-0 z-20 column-header py-1 bg-zinc-800/50 text-center"
          >
            Elemental Bonuses
          </TableHead>
          <TableHead
            colSpan={5}
            className="sticky left-0 top-0 z-20 column-header py-1 bg-zinc-800/50 text-center"
          >
            Damage Deepen
          </TableHead>
          <TableHead
            colSpan={6}
            style={getStatCellColor("aeDeep", 0)}
            className="sticky left-0 top-0 z-20 column-header py-1 bg-zinc-800/50 text-center"
          >
            Elemental Deepen
          </TableHead>
          <TableHead
            colSpan={3}
            style={getStatCellColor("bonus", 0)}
            className="sticky left-0 top-0 z-20 column-header py-1 bg-zinc-800/50 text-center"
          >
            Skill Specific
          </TableHead>
          <TableHead
            colSpan={2}
            className="sticky left-0 top-0 z-20 column-header py-1 bg-zinc-800/50 text-center"
          >
            Enemy
          </TableHead>
        </TableRow>
        {/* Table headers */}
        <TableRow>
          <TableHead className="sticky left-0 top-6 z-30 column-header py-1 bg-card text-[14px]! shadow-[inset_0_-1px_0_rgb(39,39,42)]">
            #
          </TableHead>
          <TableHead className="sticky left-5.75 top-6 z-30 min-w-28 column-header py-1 bg-card text-[14px]! shadow-[inset_0_-1px_0_rgb(39,39,42)]">
            Character
          </TableHead>
          <TableHead className="sticky left-33.75 top-6 z-30 column-header py-1 bg-card text-[14px]! shadow-[inset_0_-1px_0_rgb(39,39,42)]">
            {/* Category */}
          </TableHead>
          <TableHead className="sticky left-44 top-6 z-30 min-w-64 column-header py-1 bg-card text-[14px]! shadow-[inset_0_-1px_0_rgb(39,39,42)]">
            Skill
          </TableHead>
          <TableHead className="sticky left-108 top-6 z-30 column-header py-1 bg-card text-[14px]! shadow-[inset_0_-1px_0_rgb(39,39,42)]">
            Time
          </TableHead>
          <TableHead className="sticky left-0 top-6 z-20 column-header py-1 bg-zinc-800 text-[14px]! shadow-[inset_0_-1px_0_rgb(39,39,42)]">
            Con.
          </TableHead>
          <TableHead className="sticky left-0 top-6 z-20 column-header py-1 bg-zinc-800 text-[14px]! shadow-[inset_0_-1px_0_rgb(39,39,42)]">
            Res.
          </TableHead>
          <TableHead className="sticky left-0 top-6 z-20 min-w-16 column-header py-1 bg-zinc-800 text-[14px]! shadow-[inset_0_-1px_0_rgb(39,39,42)]">
            Damage
          </TableHead>
          <TableHead className="sticky left-0 top-6 z-20 column-header py-1 bg-zinc-800 text-[14px]! shadow-[inset_0_-1px_0_rgb(39,39,42)]">
            Procc
          </TableHead>
          <TableHead className="sticky left-0 top-6 z-20 column-header py-1 bg-card text-[14px]! min-w-70 shadow-[inset_0_-1px_0_rgb(39,39,42)]">
            Personal Buffs
          </TableHead>
          <TableHead className="sticky left-0 top-6 z-20 column-header py-1 bg-card text-[14px]! min-w-70 shadow-[inset_0_-1px_0_rgb(39,39,42)]">
            Global Buffs
          </TableHead>
          {statKeys.map((key) => {
            const statKey = key as BUFF_TYPE
            return (
              <TableHead
                key={statKey}
                className="sticky left-0 top-6 z-20 min-w-16 column-header py-1 bg-card text-[14px]! text-center"
              >
                {STAT_COLORS[statKey].label}
              </TableHead>
            )
          })}
        </TableRow>
      </TableHeader>
      {/* Table Content */}
      {resultTimeline.map((result) => {
        const {
          row,
          characterId,
          skill,
          time,
          concerto,
          resonance,
          damage,
          proc,
          buffs,
          buffsTeam,
          buffMap,
        } = result
        const character = characterTemplate[characterId as CHARACTER_KEY]
        const element = character.element
        const elementColorText = ELEMENT_COLORS[element].text

        const isCast = result.type === "cast"
        const isHit = result.type === "hit"
        const activeBuffString = buffs.join(", ")
        const activeTeamBuffString = buffsTeam.join(", ")
        const stats = Object.entries(buffMap).slice(0, statListLength) as [
          BUFF_TYPE,
          number,
        ][]

        return (
          <TableRow className="bg-card">
            <TableCell className="sticky left-0 z-10 pt-2! pl-1 pr-2 bg-card text-right text-[12px] text-muted-foreground shadow-[inset_0_-1px_0_rgb(39,39,42)]">
              {row}
            </TableCell>
            <TableCell
              className={cn(
                "sticky left-5.75 z-10 bg-card capitalize shadow-[inset_0_-1px_0_rgb(39,39,42)]",
                elementColorText,
              )}
            >
              {characterId}
            </TableCell>
            <TableCell
              className={cn(
                "sticky left-33.75 z-10 pt-2! bg-card align-middle text-[12px] font-mono uppercase tracking-wider shadow-[inset_0_-1px_0_rgb(39,39,42)]",
                isHit ? "text-transparent" : "text-muted-foreground",
              )}
            >
              {skill.category.slice(0, 5)}
            </TableCell>
            <TableCell
              className={cn(
                "sticky left-44 z-10 bg-card shadow-[inset_0_-1px_0_rgb(39,39,42)]",
                isCast ? elementColorText : "",
                isHit ? "text-xs" : "",
              )}
            >
              {skill.name}
            </TableCell>
            <TableCell className="sticky left-108 z-10 bg-card shadow-[inset_0_-1px_0_rgb(39,39,42)]">
              {frameToSecond(time)}
            </TableCell>
            <TableCell className="bg-zinc-800/50 text-right shadow-[inset_0_-1px_0_rgb(39,39,42)]">
              {concerto.toFixed(1)}
            </TableCell>
            <TableCell className="bg-zinc-800/50 text-right shadow-[inset_0_-1px_0_rgb(39,39,42)]">
              {resonance.toFixed(1)}
            </TableCell>
            <TableCell
              className={cn(
                "bg-zinc-800/50 pr-3! text-right shadow-[inset_0_-1px_0_rgb(39,39,42)]",
                damage !== 0 ? elementColorText : "",
              )}
            >
              {damage > 0 ? Math.round(damage) : "--"}
            </TableCell>
            <TableCell
              className={cn(
                "bg-zinc-800/50 pr-2! text-right shadow-[inset_0_-1px_0_rgb(39,39,42)]",
                proc.damage !== 0 ? elementColorText : "",
              )}
            >
              {proc.damage > 0 ? Math.round(proc.damage) : ""}
            </TableCell>
            <TableCell className="text-[14px] shadow-[inset_0_-1px_0_rgb(39,39,42)]">
              {`(${buffs.length || 0}) ${[activeBuffString]}`}
            </TableCell>
            <TableCell className="text-[14px] shadow-[inset_0_-1px_0_rgb(39,39,42)]">
              {`(${buffsTeam.length || 0}) ${[activeTeamBuffString]}`}
            </TableCell>
            {stats.map(([statKey, value]) => (
              <TableCell
                key={`${row}-${statKey}`}
                style={getStatCellColor(statKey, value)}
                className="pl-0 pr-2.5 text-right bg-zinc-800/50"
              >
                {toPercent(value)}
              </TableCell>
            ))}
          </TableRow>
        )
      })}
    </Table>
  )
}

export default CalculationLog
