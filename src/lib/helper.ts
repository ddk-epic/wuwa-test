import { echoData } from "@/constants/echoes"
import skillData from "@/constants/skills"
import type {
  ActiveBuffObject,
  Character,
  CharSettings,
  Skill,
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
    echo: settings.echo,
    echoSet: settings.echoSet,
    atk: (base.atk + base.weapon.atk) * levelMultiplier,
    hp: base.hp * levelMultiplier,
    def: base.def * levelMultiplier,
    crit: base.crit + bonusStats.crit,
    critDmg: base.critDmg + bonusStats.critDmg,
    bonusStats,
  }

  return newCharacter
}

export function computeCharacterSkills(character: Character) {
  const { variations, set, ...echoSkill } = echoData[character.echo]

  const echoSkills: Skill[] = [echoSkill]
  if (variations) {
    Object.entries(variations).forEach(
      ([variationKey, variation]) => {
        echoSkills.push({
          ...echoSkill,
          name: `${echoSkill.name} (${variationKey})`,
          ...variation,
        })
      },
    )
  }

  const characterSkills: Skill[] = []

  Object.values(skillData[character.id]).forEach((category) => {
    Object.values(category).forEach((skill) => {
      if (skill) {
        const { variations, ...rest } = skill
        characterSkills.push({ ...rest }) // main skill
        if (variations) {
          Object.entries(variations).forEach(([variationKey, variation]) => {
            const name = `${skill.name} (${variationKey})`
            characterSkills.push({ ...rest, ...variation, name }) // variation
          })
        }
      }
    })
  })

  return { echoSkills, characterSkills }
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
