import SequenceEntry from "./sequence-entry"

import type { ActionListItem } from "@/constants/types"

interface SequenceListProps {
  sequence: ActionListItem[]
  onRemoveSkill: (index: number) => void
}

function SequenceList({ sequence, onRemoveSkill }: SequenceListProps) {
  return (
    <main className="flex-1 overflow-y-auto px-4">
      <div className="mx-auto">
        {/* Sequence Header */}
        <div className="flex h-full flex-col mb-1 overflow-hidden border-x border-t bg-card">
          <div className="flex gap-2 px-3 py-2 border-b">
            <span className="w-4 text-[12px] font-mono uppercase tracking-widest text-muted-foreground"></span>
            <span className="w-19.5 text-[12px] font-mono uppercase tracking-widest text-muted-foreground">
              Character
            </span>
            <span className="text-[12px] font-mono uppercase tracking-widest text-muted-foreground">
              Skill
            </span>
            <span className="pr-6 ml-auto text-[12px] font-mono uppercase tracking-widest text-muted-foreground">
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
    </main>
  )
}

export default SequenceList
