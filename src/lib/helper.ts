import { getBaseSkillName } from "./utils"

import type {
  ActionListItem,
  ActiveBuffObject,
  Character,
  CharSettings,
  SKILL,
  TimelineItem,
} from "@/constants/types"
import type { CHARACTER_KEY } from "@/constants/characters"
import { echoData } from "@/constants/echoes"
import skillData from "@/constants/skills"

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

  // apply minor bonuses
  const bonusMultiplier =
    base.bonus2 === "crit" ? 2 / 3 : base.bonus2 === "critDmg" ? 4 / 3 : 1
  bonusStats[base.bonus1] += 0.12
  // TODO: implement healing bonus
  if (base.bonus2 !== "heal") {
    bonusStats[base.bonus2] += 0.12 * bonusMultiplier
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

  const echoSkills: SKILL[] = [echoSkill]
  if (variations) {
    Object.entries(variations).forEach(([variationKey, variation]) => {
      echoSkills.push({
        ...echoSkill,
        name: `${echoSkill.name} (${variationKey})`,
        ...variation,
      })
    })
  }

  const characterSkills: SKILL[] = []

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

export function computeTimeline(sequence: ActionListItem[]): ActionListItem[] {
  const lastActionEnd = {} as Record<CHARACTER_KEY, number>
  const SWITCH_CD = 60 // in frames
  // const SWAP_FRAMES = 15

  let currentTime = 0 // in frames
  let previousChar: string | null = null

  return sequence.map((entry) => {
    let start = currentTime
    const hasSwapped = previousChar && previousChar !== entry.char

    // add swap time
    // if (hasSwapped) {
    //   start += SWAP_FRAMES
    // }

    const last = lastActionEnd[entry.char]
    if (hasSwapped && last) {
      start = Math.max(start, last + SWITCH_CD)
    }

    const duration = entry.skill.frames
    const end = start + duration

    lastActionEnd[entry.char] = end
    currentTime = end
    previousChar = entry.char

    // TODO: implement skill cooldowns

    return {
      ...entry,
      time: start,
    }
  })
}

export function computeEventTimeline(
  sequence: ActionListItem[],
): TimelineItem[] {
  const timeline: TimelineItem[] = []

  for (const action of sequence) {
    // main timeline entry
    const { variations, ...actionSkill } = action.skill
    const baseName = getBaseSkillName(action.skill.name)
    const parentId = `${action.time}-${baseName}`

    const parentItem: TimelineItem = {
      char: action.char,
      type: "parent",
      skill: { ...actionSkill, mv: 0, hits: 0 },
      time: action.time,
    }

    timeline.push(parentItem)

    const { mv, hits } = action.skill

    for (let i = 0; i < mv.length; i++) {
      const hitFrame = hits[i] ?? 0

      const hitItem: TimelineItem = {
        char: action.char,
        type: "hit",
        skill: {
          ...actionSkill,
          mv: mv[i],
          hits: hitFrame,
        },
        time: action.time + hitFrame,
        parent: parentId,
      }

      timeline.push(hitItem)
    }
  }

  return timeline.sort((a, b) => a.time - b.time)
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
