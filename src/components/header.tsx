import { RotateCcw } from "lucide-react"

import { Button } from "./ui/button"
import DpsSummary from "./dps-summary"

import type { CHARACTER_KEY } from "@/constants/characters"
import type { ActionListItem, Character, Result } from "@/constants/types"
import AddCharacterModal from "./add-character-modal"

interface HeaderBarProps {
  characters: (CHARACTER_KEY | null)[]
  sequence: ActionListItem[]
  result: Result[]
  charData: (Character | null)[]
  updateCharData: (
    index: number,
    label: "sequence" | "weapon" | "echoSet",
    value: CHARACTER_KEY,
  ) => void
  onCharacterChange: (index: number, value: CHARACTER_KEY) => void
  onReset: () => void
}

function HeaderBar({
  characters,
  sequence,
  result,
  charData,
  updateCharData,
  onCharacterChange,
  onReset,
}: HeaderBarProps) {
  return (
    <header className="flex shrink-0 items-center justify-between px-6 py-4 border-b bg-card/70">
      <div className="flex items-center gap-6">
        {/* Title */}
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Team DPS Calculator
          </h1>
          <p className="text-xs text-muted-foreground">Rotation planner</p>
        </div>

        {/* Character selectors */}
        <div className="flex items-center gap-2">
          <AddCharacterModal
            characters={characters}
            charData={charData}
            updateCharData={updateCharData}
            onCharacterChange={onCharacterChange}
          />
        </div>
      </div>

      <div className="flex items-center space-x-0.75">
        {/* Inline DPS summary */}
        <DpsSummary sequence={sequence} result={result} />
        <Button
          variant="outline"
          onClick={onReset}
          className="text-muted-foreground"
          disabled={sequence.length === 0}
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </Button>
      </div>
    </header>
  )
}

export default HeaderBar
