import type {
  ActiveBuffObject,
  Character,
  CharSettings,
} from "@/constants/types"

export function computeBaseCharacter(char: Character, settings: CharSettings) {
  const levelMultiplier = 12.5
  const weaponMultiplier = 4.5

  const base = { ...char }
  const bonusStats = { ...char.bonusStats }

  // apply weapon
  if (settings.weapon) {
    base.weapon = settings.weapon
  }

  // apply weapon stat
  const mainStat = settings.weapon.mainStat
  if (mainStat in bonusStats) {
    bonusStats[mainStat] += settings.weapon.mainStatAmount * weaponMultiplier
  }

  const newCharacter: Character = {
    ...base,
    sequence: settings.sequence,
    atk: base.atk * levelMultiplier,
    hp: base.hp * levelMultiplier,
    def: base.def * levelMultiplier,
    crit: base.crit + bonusStats.crit,
    critDmg: base.critDmg + bonusStats.critDmg,
    bonusStats,
  }

  return newCharacter
}

export function hasSwapped(prevChar: string, currentChar: string) {
  return prevChar !== currentChar
}

export function removeBuffByName(array: ActiveBuffObject[], name: string) {
  const index = array.findIndex((b) => b.name === name)
  if (index !== -1) {
    array.splice(index, 1)
  }
}
