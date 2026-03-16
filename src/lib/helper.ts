import type {
  ActionListItem,
  ActiveBuffObject,
  BuffMap,
  Character,
  CharSettings,
  ELEMENT_KEY,
  Result,
  Skill,
  SKILL,
  SKILL_CATEGORY_KEY,
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

    let duration = entry.skill.frames
    const freezetime = entry.skill.freezetime
    if (freezetime) {
      duration = duration - freezetime
    }
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
    const skill = action.skill
    const { variations, ...actionSkill } = skill
    const parentId = String(action.time)

    const onCast = skill.onCast
    const parentItem: TimelineItem = {
      char: action.char,
      type: "parent",
      skill: {
        ...actionSkill,
        mv: 0,
        hits: 0,
        forte: onCast?.forte ?? 0,
        forte2: onCast?.forte2 ?? 0,
        concerto: onCast?.concerto ?? 0,
        resonance: onCast?.resonance ?? 0,
      },
      time: action.time,
    }

    timeline.push(parentItem)

    for (const hit of skill.hits) {
      const { frame, mv, forte, forte2, concerto, resonance } = hit
      const hitFrame = frame ?? 0

      const hitItem: TimelineItem = {
        char: action.char,
        type: "hit",
        skill: {
          ...actionSkill,
          name: skill.id,
          mv: mv ?? 0,
          hits: hitFrame,
          forte: forte ?? 0,
          forte2: forte2 ?? 0,
          concerto: concerto ?? 0,
          resonance: resonance ?? 0,
        },
        time: action.time + hitFrame,
        parent: parentId,
      }

      timeline.push(hitItem)
    }
  }

  return timeline.sort((a, b) => a.time - b.time)
}

export function aggregateResult(eventTimeline: Result[]): Result[] {
  // time is used to index
  const parentMap: Record<string, Result> = {}
  const result: Result[] = []

  for (let i = 0; i < eventTimeline.length; i++) {
    const row = eventTimeline[i]
    if (row.type === "parent") {
      const parent: Result = {
        ...row,
        row: i + 1,
        damage: 0,
      }
      parentMap[String(row.time)] = parent
      result.push(parent)
    }

    if (row.type === "hit" && row.parent) {
      const parent = parentMap[row.parent]
      if (!parent) continue

      parent.damage += row.damage
      parent.concerto = row.concerto
      parent.resonance = row.resonance
      parent.buffs = row.buffs
      parent.buffMap = row.buffMap
    }
  }

  return result
}

export function hasSwapped(prevChar: string, currentChar: string) {
  return prevChar !== currentChar
}

export function removeBuffByName(array: ActiveBuffObject[], id: string) {
  const index = array.findIndex((b) => b.id === id)
  if (index !== -1) {
    array.splice(index, 1)
  }
}

export function isMatch(trigger: string[] | undefined, skill: Skill) {
  const hasNameMatch = trigger?.includes(skill.id)
  const hasCategoryMatch = !!trigger?.includes(skill.category)
  return hasNameMatch || hasCategoryMatch
}

export const buffHandler = {
  BuffStacking: {
    onTrigger: (buff: ActiveBuffObject, time: number) => {
      if (!buff.stackLimit || buff.stackCount == null) return null

      const newStacks = Math.min(buff.stackCount + 1, buff.stackLimit)
      buff.stackCount = newStacks
      buff.endTime = time + buff.duration
      buff.name = `${buff.id} x${newStacks}`

      const newModifiers = buff.modifiers.map((modifier) => ({
        ...modifier,
        stackValue: newStacks * modifier.value,
      }))

      return newModifiers
    },
  },
}

export function getBonus(
  buffMap: BuffMap,
  classifications: (ELEMENT_KEY | SKILL_CATEGORY_KEY | "echo")[],
): number {
  let result = 0

  for (const key of classifications) {
    const sharedKey = key as ELEMENT_KEY | SKILL_CATEGORY_KEY
    if (buffMap[sharedKey]) {
      result += buffMap[sharedKey]
    }
    // console.log(`${ctx.row} buffMap[${sharedKey}]: ${buffMap[sharedKey]}`)
  }

  return result
}

export function getResMultiplier(enemyRes: number, resDown: number): number {
  const effectiveRes = enemyRes - resDown

  if (effectiveRes < 0.8) {
    return 1 - effectiveRes
  }

  if (effectiveRes <= 0) {
    return 1 - effectiveRes / 2
  }

  return 1 / (1 + effectiveRes * 5)
}

export function getDefMultiplier(
  characterLevel: number,
  enemyDef: number,
  defDown: number,
): number {
  const base = 800 + characterLevel * 8
  const effectiveDefense = enemyDef * (1 - defDown)

  return base / (base + effectiveDefense)
}
