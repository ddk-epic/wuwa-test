import type { Result, TimelineItem } from "@/constants/types"
import { cn } from "@/lib/utils"

interface ResultTimelineProps {
  preComputeTimeline: TimelineItem[]
  resultTimeline: Result[]
}

function ResultTimeline({
  preComputeTimeline,
  resultTimeline,
}: ResultTimelineProps) {
  return (
    <div className="text-xs">
      <div className="mb-8">
        <h1 className="font-bold">Pre-compute table</h1>
        {preComputeTimeline.map((action, i) => {
          return (
            <table className="w-120 table-fixed border-b">
              <tr>
                <td className="w-1/16 px-2">{i + 1}</td>
                <td className="w-3/16 px-2">{action.char}</td>
                <td className="w-6/16 px-2">{action.skill.name}</td>
                <td className="w-2/16 px-2">{action.time}</td>
                <td className="w-2/16 px-2">{action.skill.concerto}</td>
                <td className="w-2/16 px-2">{action.skill.resonance}</td>
                <td className="w-2/16 px-2">{action.skill.mv}</td>
                <td className="w-4/16 px-2">{action?.parent}</td>
              </tr>
            </table>
          )
        })}
      </div>
      <div>
        <h1 className="font-bold">Result (raw)</h1>
        {resultTimeline.map((result) => {
          const activeBuffString =
            result?.buffs?.map((buff) => buff.name).join(", ") ?? ""
          const finalBuffMap = (() => {
            let idx = 0
            return [6, 5, 5, 6, 5]
              .map((size) => {
                const group = result?.buffMap?.slice(idx, idx + size) ?? []
                idx += size
                return `[${group.join(" ")}]`
              })
              .join(" ")
          })()

          return (
            <table className="table-fixed border-b">
              <tr className="w-full">
                <td className="w-1/32 px-2">{result.row}</td>
                <td className="w-3/32 px-2">{result.char}</td>
                <td className="w-2/32 px-2">{result.type}</td>
                <td
                  className={cn(
                    "w-6/32 px-2",
                    result.type === "hit" ? "text-muted-foreground" : "",
                  )}
                >
                  {result.skill.name}
                </td>
                <td className="w-1/36 px-2">{result.time}</td>
                <td className="w-1/36 px-2">{result.concerto}</td>
                <td className="w-1/36 px-2">{result.resonance.toFixed(1)}</td>
                <td className="w-2/36 px-2">
                  {result.damage > 0 ? Math.round(result.damage) : "--"}
                </td>
                <td className="w-1/36 px-2">{Math.round(result.procc.damage)}</td>
                <td className="w-7/36 px-2">{activeBuffString}</td>
                <td className="w-7/36 px-2">{finalBuffMap}</td>
              </tr>
            </table>
          )
        })}
      </div>
    </div>
  )
}

export default ResultTimeline
