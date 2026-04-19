import { UserPenIcon } from "lucide-react"

import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group"
import Choose from "./choose"

import type {
  Character,
  CHARACTER_KEY,
  SETTINGS_KEY,
  TeamSlot,
} from "@/shared/types"
import { ELEMENT_COLORS } from "@/definitions/colors"
import { CHARACTERS } from "@/definitions/constants"
import { characterTemplate } from "@/content/registries/characters"
import { eAbilities } from "@/content/registries/echoes"
import { wData } from "@/content/registries/weapons"

interface AddCharacterModalProps {
  team: TeamSlot[]
  characterData: Character[]
  updateCharSettings: (
    index: number,
    label: SETTINGS_KEY,
    value: string,
  ) => void
  onCharacterChange: (selectedIds: CHARACTER_KEY[]) => void
}

function AddCharacterModal({
  team,
  characterData,
  updateCharSettings,
  onCharacterChange,
}: AddCharacterModalProps) {
  const toggleValues = team.map((slot) => slot.characterId)
  const hasCharacter = team.length > 0
  const characterString = team
    .map((slot) => (slot ? slot.characterId.capitalize() : null))
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
          <DialogTitle className="mb-2">characters Settings</DialogTitle>
        </DialogHeader>
        <div className="w-full space-y-8">
          {/* Selection */}
          <div className="">
            <ToggleGroup
              type="multiple"
              variant="outline"
              spacing={2}
              value={toggleValues}
              onValueChange={(selectedIds) =>
                onCharacterChange(selectedIds as CHARACTER_KEY[])
              }
            >
              {CHARACTERS.map((id) => {
                const element = characterTemplate[id]?.element
                return (
                  <ToggleGroupItem
                    key={id}
                    value={id}
                    className={`p-2.25 border rounded ${ELEMENT_COLORS[element].state}`}
                  >
                    {id.capitalize()}
                  </ToggleGroupItem>
                )
              })}
            </ToggleGroup>
          </div>
          <div className="flex gap-4">
            {characterData.map((character, i) => {
              const weapons = Object.values(wData).filter(
                (w) => w.type === character.weaponType,
              )
              const echoSets = Object.values(eAbilities).map((echo) => echo.set)
              const echoes = Object.keys(eAbilities)

              return (
                <div className="space-y-2 px-px">
                  <div className="aspect-4/3 border"></div>
                  <div className="space-x-2">
                    <span>{character.name}</span>
                    <span className="text-[14px] column-header">
                      {character.element}
                    </span>
                  </div>
                  <ToggleGroup
                    type="single"
                    value={character.sequence.toString() || "0"}
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
                  <div className="space-x-4 my-4">
                    {character && (
                      <div className="flex flex-col">
                        <span>ATK: {character.atk}</span>
                        <span>
                          Crit:{" "}
                          {Math.round(
                            (character.crit * 100 + Number.EPSILON) * 10,
                          ) / 10}
                          % |{" "}
                          {Math.round(
                            (character.critDmg * 100 + Number.EPSILON) * 10,
                          ) / 10}
                          %
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Choose
                      label="Weapon..."
                      array={weapons}
                      value={character.weapon.name}
                      getValue={(w) => w.name}
                      getLabel={(w) => w.name}
                      onSelect={(value) =>
                        updateCharSettings(i, "weapon", value)
                      }
                    />
                    <Choose
                      label="Echo set..."
                      array={echoSets}
                      value={`[${character?.echoSet.join(", ")}]`}
                      onSelect={(value) =>
                        updateCharSettings(i, "echoSet", value)
                      }
                    />
                    <Choose
                      label="Echo..."
                      array={echoes}
                      value={`${character.echo}`}
                      onSelect={(value) => updateCharSettings(i, "echo", value)}
                    />
                  </div>
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
