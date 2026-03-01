import type { ActionListItem } from "@/constants/types"

interface DpsSummaryProps {
  sequence: ActionListItem[]
}

function DpsSummary({ sequence }: DpsSummaryProps) {
  const totalTime =
    sequence.reduce((acc, entry) => acc + entry.skill.frames, 0) / 60

  return (
    <div className="flex items-start gap-6">
      {/* Main stats */}
      <div className="flex items-center gap-5">
        <div>
          <p className="text-[12px] font-mono uppercase tracking-widest text-muted-foreground">
            DPS
          </p>
          <p className="text-2xl font-mono font-bold text-primary leading-tight">
            100,000
          </p>
        </div>
        <div className="h-8 w-px bg-border" />
        <div>
          <p className="text-[12px] font-mono uppercase tracking-widest text-muted-foreground">
            DMG
          </p>
          <p className="text-md font-mono font-semibold text-foreground leading-tight">
            10,000
          </p>
        </div>
        <div>
          <p className="text-[12px] font-mono uppercase tracking-widest text-muted-foreground">
            Time
          </p>
          <p className="text-md font-mono font-semibold text-foreground leading-tight">
            {totalTime.toFixed(2)}s
          </p>
        </div>
      </div>
    </div>
  )
}

export default DpsSummary
