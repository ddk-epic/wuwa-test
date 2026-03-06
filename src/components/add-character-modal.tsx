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

import type { Character } from "@/constants/types"
import characterData, { CHARACTERS } from "@/constants/characters"
import { ELEMENT_COLORS } from "@/constants/colors"
import { ECHO_SETS } from "@/constants/echoes"
import { weaponData } from "@/constants/weapons"

interface AddCharacterModalProps {
  characters: (string | null)[]
  charData: (Character | null)[]
  updateCharData: (
    index: number,
    label: "sequence" | "weapon" | "echoSet",
    value: string,
  ) => void
  onCharacterChange: (index: number, value: string) => void
}

function AddCharacterModal({
  characters,
  charData,
  updateCharData,
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
            {characters.map((character, i) => {
              const availableCharacters = CHARACTERS.filter(
                (char) => !characters.includes(char) || character === char,
              )
              return (
                <div key={i} className="w-full space-y-4">
                  {/* Character selection */}
                  <div className="flex gap-1.5">
                    <Select
                      value={character ?? placeholder[i]}
                      onValueChange={(value) => onCharacterChange(i, value)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder={placeholder[i]}>
                          {character?.capitalize() ?? placeholder[i]}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent position="popper">
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
                  {character &&
                    (() => {
                      const char = characterData[character]
                      const weapons = Object.values(weaponData).filter(
                        (w) => w.type === char.weaponType,
                      )
                      return (
                        <div className="space-y-2 px-px">
                          {/* Character Image */}
                          <div className="aspect-4/3 border"></div>
                          {/* Character Stats */}
                          <div className="space-x-2">
                            <span className="uppercase">{character}</span>
                            <span className="text-xs column-header">
                              {char.element}
                            </span>
                          </div>
                          <ToggleGroup
                            type="single"
                            value={charData[i]?.sequence.toString() || "0"}
                            onValueChange={(value) => {
                              updateCharData(i, "sequence", value)
                            }}
                          >
                            {Array.from({ length: 7 }, (_, num) => (
                              <ToggleGroupItem
                                key={num}
                                value={num.toString()}
                                className={`p-2.25 border rounded ${ELEMENT_COLORS[char.element].state}`}
                              >
                                {num}
                              </ToggleGroupItem>
                            ))}
                          </ToggleGroup>
                          <div className="space-x-4 my-4">
                            <span>ATK: {char.atk}</span>
                            <span>
                              Crit: {char.crit * 100}% | {char.critDmg * 100}%
                            </span>
                          </div>
                          <div className="space-y-2">
                            <Choose
                              label="Weapon..."
                              array={weapons}
                              value={charData[i]?.weapon.name ?? "Weapon"}
                              getValue={(w) => w.name}
                              getLabel={(w) => w.name}
                              onSelect={(value) =>
                                updateCharData(i, "weapon", value)
                              }
                            />
                            <Choose
                              label="Echo set..."
                              array={ECHO_SETS}
                              value={`[${charData[i]?.echoSet.join(", ")}]`}
                              onSelect={(value) =>
                                updateCharData(i, "echoSet", value)
                              }
                            />
                            {/* <Choose label="Set config..." array={} /> */}
                          </div>
                        </div>
                      )
                    })()}
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
