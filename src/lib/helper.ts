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

  for (let i = 0; i < sequence.length; i++) {
    // main timeline entry
    const action = sequence[i]
    const { characterId, skill, time } = action
    const { variations, ...actionSkill } = skill

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

    let hitCounter = 1
    let healCounter = 1

    for (let j = 0; j < skill.hits.length; j++) {
      const hit = skill.hits[j]
      const { frame, mv } = hit
      const hitFrame = frame ?? 0

      const hitItem: TimelineEvent =
        hit.heal != undefined
          ? {
              characterId,
              type: "heal",
              skill: {
                ...actionSkill,
                name: `${skill.id} [heal ${healCounter}]`,
                mv: hit.heal ?? 0,
                flat: hit.flat ?? 0,
                hits: hitFrame,
                forte: hit.forte ?? 0,
                forte2: hit.forte2 ?? 0,
                concerto: hit.concerto ?? 0,
                resonance: hit.resonance ?? 0,
              },
              time: time + hitFrame,
              parent: String(i),
            }
          : {
              characterId,
              type: "hit",
              skill: {
                ...actionSkill,
                name: `${skill.id} [hit ${hitCounter}]`,
                mv: mv ?? 0,
                hits: hitFrame,
                forte: hit.forte ?? 0,
                forte2: hit.forte2 ?? 0,
                concerto: hit.concerto ?? 0,
                resonance: hit.resonance ?? 0,
              },
              time: time + hitFrame,
              parent: String(i),
            }

      if (hitItem.type === "hit") hitCounter++
      if (hitItem.type === "heal") healCounter++
      timeline.push(hitItem)
    }
  }

  return timeline.sort((a, b) => a.time - b.time)
}

export function updateParent(eventTimeline: Result[], entry: Result) {
  if (!entry.parent || !entry.proc.damage) return

  const parentEvent = eventTimeline[Number(entry.parent) - 1]
  if (!parentEvent) return

  parentEvent.proc.damage += entry.proc.damage
}

export function aggregateResult(eventTimeline: Result[]): Result[] {
  const parentMap = new Map<string, Result>()
  const result: Result[] = []

  let castIdx = 0

  for (let i = 0; i < eventTimeline.length; i++) {
    const entry = eventTimeline[i]

    if (entry.type === "cast") {
      const parent: Result = {
        ...entry,
        row: i + 1,
        damage: 0,
      }

      parentMap.set(String(castIdx), parent)
      result.push(parent)
      castIdx++
    }

    if ((entry.type === "hit" || entry.type === "damage") && entry.parent) {
      const parent = parentMap.get(entry.parent)
      if (!parent) continue

      parent.damage += entry.damage
      parent.concerto = entry.concerto
      parent.resonance = entry.resonance

      parent.buffs = entry.buffs
      parent.statMap = entry.statMap

      parent.proc.damage += entry.proc.damage
    }
  }

  return result
}

export function insertTimelineEvent(
  queue: TimelineEvent[],
  event: TimelineEvent,
) {
  const index = queue.findIndex((e) => e.time > event.time)

  if (index === -1) {
    queue.push(event)
  } else {
    queue.splice(index, 0, event)
  }
}
