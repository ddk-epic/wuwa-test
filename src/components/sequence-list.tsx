import { Table, TableBody, TableHead, TableHeader, TableRow } from "./ui/table"
import SequenceEntry from "./sequence-entry"

import type {
  ActionListItem,
  Character,
  Result,
} from "@/constants/types"
import type { CHARACTER_KEY } from "@/constants/characters"

interface SequenceListProps {
  charData: Record<Exclude<CHARACTER_KEY, "__none__">, Character>
  sequence: ActionListItem[]
  result: Result[]
  onRemoveSkill: (index: number) => void
}

function SequenceList({
  charData,
  sequence,
  result,
  onRemoveSkill,
}: SequenceListProps) {
  return (
    <div className="flex pl-7 pr-3 overflow-auto [scrollbar-gutter:stable]">
      <div className="flex-1">
        <Table>
          {/* Sequence header */}
          <TableHeader className="top-0 sticky z-10 border bg-card">
            <TableRow>
              <TableHead className="w-12 px-3 py-2 text-right text-xs column-header">
                #
              </TableHead>
              <TableHead className="px-3 py-2 text-xs column-header">
                Character
              </TableHead>
              <TableHead className="px-3 py-2 text-xs column-header">
                {/* Skill */}
              </TableHead>
              <TableHead className="pr-3 py-2 text-start text-xs column-header">
                Skill
              </TableHead>
              <TableHead className="px-3 py-2 text-right text-xs column-header">
                Time
              </TableHead>
              <TableHead className="px-3 py-2 text-right text-xs column-header">
                Con.
              </TableHead>
              <TableHead className="px-3 py-2 text-right text-xs column-header">
                Res.
              </TableHead>
              <TableHead className="px-3 py-2 text-right text-xs column-header">
                Damage
              </TableHead>
              <TableHead className="px-3 py-2 text-right text-xs column-header">
                Procc
              </TableHead>
              <TableHead className="px-3 py-2 text-start text-xs column-header">
                Buffs
              </TableHead>
              <TableHead className="px-3 py-2 text-start text-xs column-header">
                BuffMap
              </TableHead>
              <TableHead className="px-3 py-2 text-xs column-header">
                {/* Button */}
              </TableHead>
            </TableRow>
          </TableHeader>
          {/* Sequence list */}
          <TableBody>
            {sequence.map((action, i) => {
              return (
                <SequenceEntry
                  key={`${action.skill.name}-${i}`}
                  index={i}
                  charData={charData}
                  entry={action}
                  res={result}
                  onRemove={() => onRemoveSkill(i)}
                />
              )
            })}
          </TableBody>
        </Table>
        {sequence.length === 0 && (
          <div className="h-80 flex items-center justify-center border border-dashed">
            <p className="text-md text-muted-foreground">
              Add skills from the sidebar to build your rotation.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SequenceList
