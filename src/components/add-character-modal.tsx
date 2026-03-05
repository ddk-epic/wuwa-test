import { UserPenIcon } from "lucide-react"

import { Button } from "./ui/button"
import Choose from "./choose"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group"

import characterData, { CHARACTERS } from "@/constants/characters"
import { ELEMENT_COLORS } from "@/constants/colors"
import { ECHO_SETS } from "@/constants/echoes"
import { WEAPONS } from "@/constants/weapons"

interface AddCharacterModalProps {
  characters: (string | null)[]
  onCharacterChange: (index: number, value: string) => void
}

function AddCharacterModal({
  characters,
  onCharacterChange,
}: AddCharacterModalProps) {
  const placeholder = ["Character 1", "Character 2", "Character 3"]
  const hasCharacter = characters.some((character) => character !== null)
  const characterString = characters
    .map((character) => (character ? character.capitalize() : null))
    .filter(Boolean)
    .join(" / ")

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="border">
          {hasCharacter ? (
            characterString
          ) : (
            <div className="flex items-center gap-2">
              <UserPenIcon />
              Characters
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-card">
        <DialogHeader>
          <DialogTitle className="mb-2">Team Settings</DialogTitle>
        </DialogHeader>
        <div>
          <div className="flex gap-2">
            {characters.map((slot, i) => {
              const character = slot ?? placeholder[i]
              const element = characterData[character]?.element ?? "default"
              const availableCharacters = CHARACTERS.filter(
                (char) => !characters.includes(char) || characters[i] === char,
              )
              return (
                <div key={i} className="w-full space-y-4">
                  {/* Character selection */}
                  <div className="flex gap-1.5">
                    <Select
                      value={character}
                      onValueChange={(value) => onCharacterChange(i, value)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder={placeholder[i]}>
                          {character.capitalize()}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="w-2xl">
                        <SelectItem key={0} value="__none__">
                          Character...
                        </SelectItem>
                        {availableCharacters.map((char, idx) => (
                          <SelectItem key={idx + 1} value={char}>
                            {char.capitalize()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Character settings */}
                  {slot && (
                    <div className="space-y-2 px-px">
                      <div className="aspect-4/3 border"></div>
                      <div className="uppercase">{character}</div>
                      <ToggleGroup type="single">
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <ToggleGroupItem
                            key={num}
                            value={num.toString()}
                            onClick={() => {}}
                            className={`border rounded ${ELEMENT_COLORS[element].state}`}
                          >
                            {num}
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                      <div>atk | crit values</div>
                      <div className="space-y-2">
                        <Choose label="Weapon..." array={WEAPONS} />
                        <Choose label="Echo set..." array={ECHO_SETS} />
                        {/* <Choose label="Set config..." array={} /> */}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddCharacterModal
