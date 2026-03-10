import { UserPenIcon } from "lucide-react"

import { Button } from "./ui/button"
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
import Choose from "./choose"

import type { Character, TeamSlot } from "@/constants/types"
import { CHARACTERS, type CHARACTER_KEY } from "@/constants/characters"
import { ELEMENT_COLORS } from "@/constants/colors"
import { echoData } from "@/constants/echoes"
import { weaponData } from "@/constants/weapons"

interface AddCharacterModalProps {
  team: TeamSlot[]
  charData: Record<CHARACTER_KEY, Character>
  updateCharSettings: (
    index: number,
    label: "sequence" | "weapon" | "echoSet",
    value: string,
  ) => void
  onCharacterChange: (index: number, value: CHARACTER_KEY) => void
}

function AddCharacterModal({
  team,
  charData,
  updateCharSettings,
  onCharacterChange,
}: AddCharacterModalProps) {
  const placeholder = ["Character 1", "Character 2", "Character 3"]
  const hasCharacter = team.some((slot) => slot.character !== null)
  const characterString = team
    .map((slot) => (slot.character ? slot.character.name : null))
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
            {team.map((slot, i) => {
              const character = slot.character
              const availableCharacters = CHARACTERS.filter(
                (char) =>
                  !character?.id.includes(char) || character?.id === char,
              )
              return (
                <div key={i} className="w-full space-y-4">
                  {/* Character selection */}
                  <div className="flex gap-1.5">
                    <Select
                      value={character?.name ?? placeholder[i]}
                      onValueChange={(value) =>
                        onCharacterChange(i, value as CHARACTER_KEY)
                      }
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder={placeholder[i]}>
                          {character?.name ?? placeholder[i]}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {availableCharacters.map((char, idx) => (
                          <SelectItem key={idx} value={char}>
                            {char === "__none__"
                              ? "Character..."
                              : char.capitalize()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Character settings */}
                  {character &&
                    (() => {
                      const weapons = Object.values(weaponData).filter(
                        (w) => w.type === character.weaponType,
                      )
                      const echoes = Object.keys(echoData)
                      return (
                        <div className="space-y-2 px-px">
                          {/* Character Image */}
                          <div className="aspect-4/3 border"></div>
                          {/* Character Stats */}
                          <div className="space-x-2">
                            <span>{character.name}</span>
                            <span className="text-xs column-header">
                              {character.element}
                            </span>
                          </div>
                          <ToggleGroup
                            type="single"
                            value={charData[character.id].sequence.toString() || "0"}
                            onValueChange={(value) => {
                              updateCharSettings(i, "sequence", value)
                            }}
                          >
                            {Array.from({ length: 7 }, (_, num) => (
                              <ToggleGroupItem
                                key={num}
                                value={num.toString()}
                                className={`p-2.25 border rounded ${ELEMENT_COLORS[character.element].state}`}
                              >
                                {num}
                              </ToggleGroupItem>
                            ))}
                          </ToggleGroup>
                          {/* Char stats */}
                          <div className="space-x-4 my-4">
                            {charData[character.id] && (
                              <>
                                <span>ATK: {charData[character.id].atk}</span>
                                <span>
                                  Crit:{" "}
                                  {Math.round(
                                    (charData[character.id].crit * 100 + Number.EPSILON) *
                                      10,
                                  ) / 10}
                                  % |{" "}
                                  {Math.round(
                                    (charData[character.id].critDmg * 100 +
                                      Number.EPSILON) *
                                      10,
                                  ) / 10}
                                  %
                                </span>
                              </>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Choose
                              label="Weapon..."
                              array={weapons}
                              value={charData[character.id].weapon.name ?? "Weapon"}
                              getValue={(w) => w.name}
                              getLabel={(w) => w.name}
                              onSelect={(value) =>
                                updateCharSettings(i, "weapon", value)
                              }
                            />
                            <Choose
                              label="Echo set..."
                              array={echoes}
                              value={`[${charData[character.id]?.echoSet.join(", ")}]`}
                              onSelect={(value) =>
                                updateCharSettings(i, "echoSet", value)
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
