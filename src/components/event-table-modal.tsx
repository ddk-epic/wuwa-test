import { cn } from "@/lib/utils"

import { CalendarSearch } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import ResultTimeline from "./result-timeline"

import type { Result, TimelineItem } from "@/constants/types"

interface EventTableModalProps {
  preComputeTimeline: TimelineItem[]
  resultTimeline: Result[]
}

function EventTableModal({
  preComputeTimeline,
  resultTimeline,
}: EventTableModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 rounded-lg px-4 py-2.5 z-10 text-sm font-semibold brightness-90 shadow-lg transition-all",
            resultTimeline.length === 0
              ? "border border-border bg-secondary text-muted-foreground"
              : "border bg-primary text-primary-foreground hover:brightness-110",
          )}
          disabled={resultTimeline.length === 0}
        >
          <CalendarSearch />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-screen bg-card overflow-auto">
        <DialogHeader>
          <DialogTitle className="mb-2">Event Table</DialogTitle>
        </DialogHeader>
        <ResultTimeline
          preComputeTimeline={preComputeTimeline}
          resultTimeline={resultTimeline}
        />
      </DialogContent>
    </Dialog>
  )
}

export default EventTableModal
