import SequenceEntry from "./sequence-entry"

import type { ActionListItem } from "@/constants/types"

interface SequenceListProps {
  sequence: ActionListItem[]
  onRemoveSkill: (index: number) => void
}

function SequenceList({ sequence, onRemoveSkill }: SequenceListProps) {
  return (
    <div className="flex-2 overflow-y-auto">
      <div>
        {/* Sequence Header */}
        <div className="flex h-full flex-col mb-1 border-x border-t bg-card overflow-hidden opacity-85">
          <div className="flex gap-2 px-3 py-2 border-b">
            <span className="w-4 text-[12px] column-header"></span>
            <span className="w-19.5 text-[12px] column-header">Character</span>
            <span className="text-[12px] column-header">Skill</span>
            <span className="pr-6 ml-auto text-[12px] column-header">
              Time&thinsp;(s)
            </span>
          </div>
        </div>
        {/* Sequence list */}
        {sequence.length === 0 ? (
          <div className="h-48 flex items-center justify-center border border-dashed">
            <p className="text-md text-muted-foreground">
              Add skills from the sidebar to build your rotation.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {sequence.map((action, i) => (
              <SequenceEntry
                key={`${action.skill.name}-${i}`}
                entry={action}
                index={i}
                onRemove={() => onRemoveSkill(i)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SequenceList
