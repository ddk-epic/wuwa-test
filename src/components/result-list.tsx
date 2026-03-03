import type { Result } from "@/constants/types"
import ResultEntry from "./result-entry"

interface ResultListProps {
  result: Result[]
  setResult: React.Dispatch<React.SetStateAction<Result[]>>
}

function ResultList({ result }: ResultListProps) {
  if (result.length > 0) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div>
          {/* Sequence Header */}
          <div className="flex h-full flex-col mb-1 overflow-hidden border-x border-t bg-card">
            <div className="flex gap-2 px-3 py-2 border-b">
              <span className="w-4 text-[12px] column-header"></span>
              <span className="w-19.5 text-[12px] column-header">Damage</span>
            </div>
          </div>
          {/* Sequence list */}
          <div className="flex flex-col gap-1">
            {result.map((action, i) => (
              <ResultEntry
                key={`${action.skill.name}-${i}`}
                entry={action}
                index={i}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default ResultList
