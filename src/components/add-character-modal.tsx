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

import { CHARACTERS } from "@/constants/characters"

interface AddCharacterModalProps {
  characters: (string | null)[]
  onCharacterChange: (index: number, value: string) => void
}

function AddCharacterModal({ characters, onCharacterChange }: AddCharacterModalProps) {
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
      <DialogContent className="bg-card">
        <DialogHeader>
          <DialogTitle className="mb-2">Team Settings</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2">
          {characters.map((slot, i) => {
            const character = slot ?? placeholder[i]
            const availableCharacters = CHARACTERS.filter(
              (char) => !characters.includes(char) || characters[i] === char,
            )
            return (
              <div key={i} className="w-full flex gap-1.5">
                <Select onValueChange={(value) => onCharacterChange(i, value)}>
                  <SelectTrigger className="grow">
                    <SelectValue placeholder={character.capitalize()}>
                      {character.capitalize()}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key={0} value="__none__">
                        Character...
                      </SelectItem>
                    {availableCharacters.map((char, idx) => (
                      <SelectItem key={idx+1} value={char}>
                        {char.capitalize()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddCharacterModal
