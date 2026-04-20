import { computeBaseCharacter } from "@/lib/helper"

import type {
  CHARACTER_KEY,
  CharSettings,
  Character,
  ECHO_KEY,
  ECHO_SET_KEY,
  WEAPON_KEY,
} from "@/shared/types"

import { CHARACTERS } from "@/definitions/constants"
import { cAbilities, characterTemplate } from "@/definitions/characters"
import { wData } from "@/definitions/weapons"

export function isCharacterKey(key: any): key is CHARACTER_KEY {
  return (CHARACTERS as readonly string[]).includes(key)
}

export function skillOf(characterId: CHARACTER_KEY) {
  return cAbilities[characterId]
}

export function createCharacter(
  characterId: CHARACTER_KEY,
  overrides: Partial<{
    sequence: number
    weapon: WEAPON_KEY
    echoSet: ECHO_SET_KEY
    echo: ECHO_KEY
  }> = {},
): Character {
  const template = characterTemplate[characterId]

  const settings: CharSettings = {
    sequence: overrides.sequence ?? 0,
    weapon: overrides.weapon ? wData[overrides.weapon] : template.weapon,
    echoSet: overrides.echoSet ? [overrides.echoSet] : template.echoSet,
    echo: overrides.echo ? overrides.echo : template.echo,
  }

  return computeBaseCharacter(characterId, settings)
}

export function createTeam(
  ...characters: (
    | CHARACTER_KEY
    | [
        CHARACTER_KEY,
        overrides: Partial<{
          sequence: number
          weapon: WEAPON_KEY
          echoSet: ECHO_SET_KEY
          echo: ECHO_KEY
        }>,
      ]
  )[]
): Character[] {
  return characters.map((entry) => {
    if (isCharacterKey(entry)) {
      return createCharacter(entry)
    }
    const [id, overrides] = entry
    return createCharacter(id, overrides)
  })
}
