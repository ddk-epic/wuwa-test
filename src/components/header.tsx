import { RotateCcw } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import DpsSummary from "./dps-summary"

import type { ActionListItem } from "@/constants/types"
import { CHARACTERS } from "@/constants/characters"

interface HeaderBarProps {
  characters: (string | null)[]
  sequence: ActionListItem[]
  setCharacters: React.Dispatch<React.SetStateAction<(string | null)[]>>
  setSequence: React.Dispatch<React.SetStateAction<ActionListItem[]>>
}

function HeaderBar({
  characters,
  sequence,
  setCharacters,
  setSequence,
}: HeaderBarProps) {
  const handleSelect = (index: number, value: string) => {
    const newSlots = [...characters]
    newSlots[index] = value
    setCharacters(newSlots)
  }

  const handleReset = () => {
    setSequence([])
  }

  return (
    <header className="flex shrink-0 items-center justify-between px-6 py-4 border-b">
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
          {["Character 1", "Character 2", "Character 3"].map((slot, i) => {
            const availableCharacters = CHARACTERS.filter(
              (char) => !characters.includes(char) || characters[i] === char,
            )

            return (
              <div key={i} className="flex items-center gap-1.5">
                <Select onValueChange={(value) => handleSelect(i, value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder={slot}>
                      {characters[i]
                        ? characters[i].charAt(0).toUpperCase() +
                          characters[i].slice(1)
                        : ""}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {availableCharacters.map((char, idx) => (
                      <SelectItem key={idx} value={char}>
                        {char.charAt(0).toUpperCase() + char.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex items-center gap-5">
        {/* Inline DPS summary */}
        <DpsSummary sequence={sequence} />

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
          disabled={sequence.length === 0}
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>
    </header>
  )
}

export default HeaderBar
