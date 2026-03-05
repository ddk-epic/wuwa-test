import { RotateCcw } from "lucide-react"

import { Button } from "./ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import DpsSummary from "./dps-summary"

import type { ActionListItem, Result } from "@/constants/types"
import { CHARACTERS } from "@/constants/characters"

interface HeaderBarProps {
  characters: (string | null)[]
  sequence: ActionListItem[]
  result: Result[]
  onSelect: (index: number, value: string) => void
  onReset: () => void
}

function HeaderBar({
  characters,
  sequence,
  result,
  onSelect,
  onReset,
}: HeaderBarProps) {
  const placeholder = ["Character 1", "Character 2", "Character 3"]

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
          {characters.map((slot, i) => {
            const character = slot ?? placeholder[i]
            const availableCharacters = CHARACTERS.filter(
              (char) => !characters.includes(char) || characters[i] === char,
            )

            return (
              <div key={i} className="flex items-center gap-1.5">
                <Select onValueChange={(value) => onSelect(i, value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder={character.capitalize()}>
                      {character.capitalize()}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {availableCharacters.map((char, idx) => (
                      <SelectItem key={idx} value={char}>
                        {char.capitalize()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )
          })}
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
