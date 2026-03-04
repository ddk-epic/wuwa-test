import type { Result } from "@/constants/types"
import ResultEntry from "./result-entry"

interface ResultListProps {
  result: Result[]
  setResult: React.Dispatch<React.SetStateAction<Result[]>>
}

function ResultList({ result }: ResultListProps) {
  if (result.length > 0) {
    return (
      <div className="flex-1">
        <div>
          {/* Result list */}
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
