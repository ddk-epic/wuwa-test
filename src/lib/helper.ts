import skillData from "@/definitions/abilities"
import characterTemplate from "@/definitions/characters"
import echoData from "@/definitions/echoes"

import type {
  ActionListItem,
  Character,
  CHARACTER_KEY,
  CharSettings,
  Result,
  SKILL,
  TimelineEvent,
} from "@/shared/types"

export function computeBaseCharacter(
  characterId: CHARACTER_KEY,
  settings: CharSettings,
) {
  const levelMultiplier = 12.5
  const weaponMultiplier = 4.5

  const char = characterTemplate[characterId]
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

export function computeCharacterSkills(characterId: CHARACTER_KEY) {
  const character = characterTemplate[characterId]
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
        const frames = skill.freezetime
          ? skill.frames - skill.freezetime
          : skill.frames
        characterSkills.push({
          ...rest,
          frames,
        }) // main skill
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
  const lastActionEnd = new Map() as Map<CHARACTER_KEY, number>
  const SWITCH_CD = 60 // in frames
  // const SWAP_FRAMES = 15

  let currentTime = 0 // in frames
  let previousChar: CHARACTER_KEY | null = null

  return sequence.map((entry) => {
    const characterId = entry.characterId
    const skill = entry.skill
    const hasSwapped = previousChar && previousChar !== characterId

    let start = currentTime

    // add swap time
    // if (hasSwapped) {
    //   start += SWAP_FRAMES
    // }

    const lastEnd = lastActionEnd.get(characterId)
    if (hasSwapped && lastEnd != null) {
      start = Math.max(start, lastEnd + SWITCH_CD)
    }

    const duration = skill.frames
    const end = start + duration

    // console.table({
    //   skill: skill.name,
    //   start,
    //   duration,
    //   end,
    // })

    lastActionEnd.set(characterId, end)
    currentTime = end
    previousChar = characterId

    // TODO: implement skill cooldowns

    return {
      ...entry,
      time: start,
    }
  })
}

export function computeEventTimeline(
  sequence: ActionListItem[],
): TimelineEvent[] {
  const timeline: TimelineEvent[] = []

  for (const action of sequence) {
    // main timeline entry
    const { characterId, skill, time } = action
    const { variations, ...actionSkill } = skill
    const parentId = String(time)

    const onCast = skill.onCast
    const parentItem: TimelineEvent = {
      characterId,
      type: "cast",
      skill: {
        ...actionSkill,
        mv: 0,
        hits: 0,
        forte: onCast?.forte ?? 0,
        forte2: onCast?.forte2 ?? 0,
        concerto: onCast?.concerto ?? 0,
        resonance: onCast?.resonance ?? 0,
      },
      time,
    }

    timeline.push(parentItem)

    for (let i = 0; i < skill.hits.length; i++) {
      const hit = skill.hits[i]
      const { frame, mv, forte, forte2, concerto, resonance } = hit
      const hitFrame = frame ?? 0

      const hitItem: TimelineEvent = {
        characterId,
        type: "hit",
        skill: {
          ...actionSkill,
          name: `${skill.id} [hit ${i + 1}]`,
          mv: mv ?? 0,
          hits: hitFrame,
          forte: forte ?? 0,
          forte2: forte2 ?? 0,
          concerto: concerto ?? 0,
          resonance: resonance ?? 0,
        },
        time: time + hitFrame,
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
    if (row.type === "cast") {
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
      parent.statMap = row.statMap

      parent.proc.damage += row.proc.damage
    }
  }

  return result
}
