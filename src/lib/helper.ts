import { cAbilities } from "@/definitions/characters"
import { characterTemplate } from "@/definitions/characters"
import echoData from "@/content/echoes/data"

import type {
  Action,
  Character,
  CHARACTER_KEY,
  CharSettings,
  Result,
  SKILL,
  StateContext,
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

export function computeCharacterSkills(
  characterId: CHARACTER_KEY,
): Map<string, SKILL> {
  const character = characterTemplate[characterId]
  const { variations, set, ...echoSkill } = echoData[character.echo]

  const skillMap = new Map<string, SKILL>()

  // echo base
  skillMap.set(echoSkill.id, echoSkill)

  // echo variations
  if (variations) {
    Object.entries(variations).forEach(([variationKey, variation]) => {
      const id = `${echoSkill.id}_${variationKey}`
      skillMap.set(id, {
        ...echoSkill,
        name: `${echoSkill.name} (${variationKey})`,
        ...variation,
      })
    })
  }

  // character skills
  Object.values(cAbilities[character.id]).forEach((category) => {
    Object.values(category).forEach((skill) => {
      if (!skill) return

      const { variations, ...rest } = skill

      const frames = skill.freezetime
        ? skill.frames - skill.freezetime
        : skill.frames

      skillMap.set(skill.id, {
        ...rest,
        frames,
      })

      // character variations
      if (variations) {
        Object.entries(variations).forEach(([variationKey, variation]) => {
          const id = `${skill.id}_${variationKey}`
          skillMap.set(id, {
            ...rest,
            ...variation,
            name: `${skill.name} (${variationKey})`,
          })
        })
      }
    })
  })

  return skillMap
}

export function refreshActionList(
  skillData: Map<CHARACTER_KEY, Map<string, SKILL>>,
  actionList: Action[],
): Action[] {
  return actionList.map((action) => {
    const characterId = action.characterId
    const newSkill = skillData.get(characterId)?.get(action.skill.id)

    if (!newSkill) {
      console.log(`${action.skill.id} could not be found.`)
      return action
    }

    return {
      ...action,
      skill: newSkill,
    }
  })
}

export function computeTimeline(actionList: Action[]): Action[] {
  const lastActionEnd = new Map() as Map<CHARACTER_KEY, number>
  const SWITCH_CD = 60 // in frames
  // const SWAP_DELAY = 15

  let currentTime = 0 // in frames
  let previousChar: CHARACTER_KEY | null = null

  return actionList.map((entry) => {
    const { characterId, skill } = entry
    const hasSwapped = previousChar && previousChar !== characterId

    let start = currentTime

    // add swap time
    // if (hasSwapped) {
    //   start += SWAP_DELAY
    // }

    const lastEnd = lastActionEnd.get(characterId)
    if (hasSwapped && lastEnd != null) {
      start = Math.max(start, lastEnd + SWITCH_CD)
    }

    const duration = skill?.frames ?? 0
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

export function computeEventTimeline(actionList: Action[]): TimelineEvent[] {
  const timeline: TimelineEvent[] = []

  // main event
  for (let i = 0; i < actionList.length; i++) {
    const counters: Record<string, number> = {}

    const action = actionList[i]
    const { characterId, skill, time } = action
    const { variations, ...actionSkill } = skill

    const castEvent: TimelineEvent = {
      id: String(i),
      characterId,
      type: skill.hits[0]?.type ?? "damage",
      index: 0,
      skill: {
        ...actionSkill,
        mv: 0,
        forte: 0,
        forte2: 0,
        concerto: 0,
        resonance: 0,
      },
      time,
    }

    timeline.push(castEvent)

    // sub events
    for (let j = 0; j < skill.hits.length; j++) {
      const hit = skill.hits[j]
      const { frame, mv } = hit
      const hitFrame = frame ?? 0

      const type = hit?.type ?? "damage"

      const counter = (counters[type] ?? 0) + 1
      counters[type] = counter

      const subEvent: TimelineEvent = {
        id: `${i}-${j}`,
        characterId,
        type,
        index: j+1,
        skill: {
          ...actionSkill,
          name: `${skill.id} [${type} ${counter}]`,
          mv: mv ?? 0,
          flat: hit.flat ?? 0,
          forte: hit.forte ?? 0,
          forte2: hit.forte2 ?? 0,
          concerto: hit.concerto ?? 0,
          resonance: hit.resonance ?? 0,
        },
        time: time + hitFrame,
        sourceEventId: castEvent.id,
      }

      timeline.push(subEvent)
    }
  }

  return timeline.sort((a, b) => a.time - b.time)
}

export function aggregateResult(resultTimeline: Result[]): Result[] {
  const parentMap = new Map<string, Result>()
  const result: Result[] = []

  let castIdx = 0

  for (let i = 0; i < resultTimeline.length; i++) {
    const entry = resultTimeline[i]

    // cast event
    if (entry.index === 0) {
      const parent: Result = {
        ...entry,
        row: i + 1,
        // overwrite values for log
        damage: 0,
        proc: { heal: 0, shield: 0 },
      }

      parentMap.set(String(castIdx), parent)
      result.push(parent)
      castIdx++
    }

    // only non-cast events have a sourceEventId
    if (entry.sourceEventId) {
      const parent = parentMap.get(entry.sourceEventId)
      if (!parent) continue

      parent.damage += entry.damage
      parent.concerto = entry.concerto
      parent.resonance = entry.resonance

      parent.buffs = entry.buffs
      parent.statMap = entry.statMap

      parent.proc.heal += entry.proc.heal
      parent.proc.shield += entry.proc.shield

      for (const [id, message] of entry.message.warning) {
        parent.message.warning.set(id, message)
      }
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

export function generateWarningMessage(
  state: StateContext,
  reqKey: string,
  reqValue: number,
): StateContext {
  const newWarning = new Map(state.message.warning)

  // evaluate dCond
  if (reqValue < 0) {
    newWarning.set(
      reqKey,
      `Missing ${reqKey}! Skill "${state.action.skill.name}" requires at least ${Math.abs(reqValue)} more ${reqKey}`,
    )
  }
  return {
    ...state,
    message: { warning: newWarning },
  }
}
