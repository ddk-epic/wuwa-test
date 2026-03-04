import SequenceEntry from "./sequence-entry"

import type { ActionListItem } from "@/constants/types"

interface SequenceListProps {
  sequence: ActionListItem[]
  onRemoveSkill: (index: number) => void
}

function SequenceList({ sequence, onRemoveSkill }: SequenceListProps) {
  return (
    <div className="flex-1">
      <div>
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
