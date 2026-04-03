import { cn } from "@/lib/utils"

import { CalendarSearch } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"

import type { Result } from "@/shared/types"
import CalculationLog from "./calculation-log"

interface EventTableModalProps {
  resultTimeline: Result[]
}

function EventTableModal({ resultTimeline }: EventTableModalProps) {
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
      <DialogContent className="max-w-[80vw] h-full max-h-[90vh] flex flex-col p-0 bg-card overflow-hidden">
        <DialogHeader className="items-center pt-3">
          <DialogTitle className="text-lg font-medium">
            Rotation Log
          </DialogTitle>
        </DialogHeader>
        <div className="grow overflow-auto">
          <CalculationLog resultTimeline={resultTimeline} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EventTableModal
