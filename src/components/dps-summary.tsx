import type { ActionListItem, Result } from "@/shared/types"

interface DpsSummaryProps {
  sequence: ActionListItem[]
  result: Result[]
}

function DpsSummary({ sequence, result }: DpsSummaryProps) {
  const totalDamage = result.reduce((acc, entry) => acc + entry.damage, 0)
  const totalTime =
    sequence.reduce((acc, entry) => acc + entry.skill.frames, 0) / 60
  const totalDps = totalDamage / totalTime || 0

  return (
    <div className="flex items-start gap-6 pr-2">
      {/* Main stats */}
      <div className="flex items-center gap-5">
        <div>
          <p className="text-xs column-header">DMG</p>
          <p className="text-2xl font-mono font-bold text-primary leading-tight">
            {Math.round(totalDamage).toLocaleString("en-US")}
          </p>
        </div>
        <div className="h-8 w-px bg-border" />
        <div className="min-w-16">
          <p className="text-xs column-header">DPS</p>
          <p className="text-md font-mono font-semibold text-foreground leading-tight">
            {Math.round(totalDps).toLocaleString("en-US")}
          </p>
        </div>
        <div className="min-w-16">
          <p className="text-xs column-header">Time</p>
          <p className="text-md font-mono font-semibold text-foreground leading-tight">
            {totalTime.toFixed(2)}s
          </p>
        </div>
      </div>
    </div>
  )
}

export default DpsSummary
