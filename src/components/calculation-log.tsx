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
    <Table className="w-full border-b">
      {/* Table group headers */}
      <TableHeader>
        <TableRow className="border-t">
          <TableHead
            colSpan={4}
            className="column-header py-1 text-center text-[16px]!"
          >
            Entry
          </TableHead>
          <TableHead
            colSpan={5}
            className="bg-zinc-800/70 column-header py-1 text-center text-[16px]!"
          >
            Result
          </TableHead>
          <TableHead
            colSpan={2}
            className="column-header py-1 text-center text-[16px]!"
          >
            Buffs
          </TableHead>
          <TableHead
            colSpan={6}
            style={getStatCellColor("atk", 0.2)}
            className="column-header py-1 text-center text-[16px]! bg-zinc-800/70"
          >
            Final Stats
          </TableHead>
          <TableHead
            colSpan={5}
            
            style={getStatCellColor("basic", 0.2)}
            className="column-header py-1 text-center text-[16px]!"
          >
            Damage Bonuses
          </TableHead>
          <TableHead
            colSpan={6}
            
            style={getStatCellColor("aero", 0.2)}
            className="column-header py-1 text-center text-[16px]! bg-zinc-800/70"
          >
            Elemental Bonuses
          </TableHead>
          <TableHead
            colSpan={5}
            style={getStatCellColor("baDeep", 0)}
            className="column-header py-1 text-center text-[16px]!"
          >
            Damage Deepen
          </TableHead>
          <TableHead
            colSpan={6}
            
            style={getStatCellColor("aeDeep", 0)}
            className="column-header py-1 text-center text-[16px]! bg-zinc-800/70"
          >
            Elemental Deepen
          </TableHead>
          <TableHead
            colSpan={3}
            
            style={getStatCellColor("bonus", 0)}
            className="column-header py-1 text-center text-[16px]!"
          >
            Skill Specific
          </TableHead>
          <TableHead
            colSpan={2}
            className="column-header py-1 text-center text-[16px]! bg-zinc-800/70"
          >
            Enemy
          </TableHead>
        </TableRow>
        {/* Table headers */}
        <TableRow>
          <TableHead className="column-header py-1 text-[14px]!">#</TableHead>
          <TableHead className="min-w-28 column-header py-1 text-[14px]!">
            Character
          </TableHead>
          <TableHead className="column-header py-1 text-[14px]!">
            {/* Category */}
          </TableHead>
          <TableHead className="min-w-64 column-header py-1 text-[14px]!">
            Skill
          </TableHead>
          <TableHead className="column-header py-1 text-[14px]! bg-zinc-800/70">
            Time
          </TableHead>
          <TableHead className="column-header py-1 text-[14px]! bg-zinc-800/70">
            Con.
          </TableHead>
          <TableHead className="column-header py-1 text-[14px]! bg-zinc-800/70">
            Res.
          </TableHead>
          <TableHead className="min-w-16 column-header py-1 text-[14px]! bg-zinc-800/70">
            Damage
          </TableHead>
          <TableHead className="column-header py-1 text-[14px]! bg-zinc-800/70">
            Procc
          </TableHead>
          <TableHead className="column-header py-1 text-[14px]! min-w-70">
            Personal Buffs
          </TableHead>
          <TableHead className="column-header py-1 text-[14px]! min-w-70">
            Global Buffs
          </TableHead>
          {statKeys.map((key) => {
            const statKey = key as BUFF_TYPE
            return (
              <TableHead
                key={statKey}
                className="min-w-16 column-header py-1 text-[14px]! text-center bg-zinc-800/70"
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
          <TableRow>
            <TableCell className="pt-2! pl-1 pr-2 text-right text-[12px] text-muted-foreground">
              {row}
            </TableCell>
            <TableCell className={cn("capitalize", elementColorText)}>
              {characterId}
            </TableCell>
            <TableCell
              className={cn(
                "pt-2! align-middle text-[12px] font-mono uppercase tracking-wider",
                isHit ? "text-transparent" : "text-muted-foreground",
              )}
            >
              {skill.category.slice(0, 5)}
            </TableCell>
            <TableCell
              className={cn(
                "",
                isCast ? elementColorText : "",
                isHit ? "text-xs" : "",
              )}
            >
              {skill.name}
            </TableCell>
            <TableCell className="bg-zinc-800/70 text-right">
              {frameToSecond(time)}
            </TableCell>
            <TableCell className="bg-zinc-800/70 text-right">
              {concerto.toFixed(1)}
            </TableCell>
            <TableCell className="bg-zinc-800/70 text-right">
              {resonance.toFixed(1)}
            </TableCell>
            <TableCell
              className={cn(
                "bg-zinc-800/70 pr-3! text-right",
                damage !== 0 ? elementColorText : "",
              )}
            >
              {damage > 0 ? Math.round(damage) : "--"}
            </TableCell>
            <TableCell
              className={cn(
                "bg-zinc-800/70 pr-2! text-right",
                proc.damage !== 0 ? elementColorText : "",
              )}
            >
              {proc.damage > 0 ? Math.round(proc.damage) : ""}
            </TableCell>
            <TableCell className="">{`(${buffs.length || 0}) ${[activeBuffString]}`}</TableCell>
            <TableCell className="">{`(${buffsTeam.length || 0}) ${[activeTeamBuffString]}`}</TableCell>
            {stats.map(([statKey, value]) => (
              <TableCell
                key={`${row}-${statKey}`}
                style={getStatCellColor(statKey, value)}
                className="pl-0 pr-2.5 text-right bg-zinc-800/70"
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
