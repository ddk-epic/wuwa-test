import { BONUSSTAT_KEYS } from "@/definitions/constants"

import { cBuffs } from "@/definitions/characters"
import { wBuffs } from "@/definitions/weapons"
import { sBuffs } from "@/definitions/echoes"
import { eBuffs } from "@/definitions/echoes"

import { baseStatMap, getSkillLevel } from "@/shared/maps"
import type {
  Character,
  CHARACTER_KEY,
  StateContext,
  Result,
  TimelineEvent,
  BUFF_TYPE,
  BuffDefinition,
  BuffInstance,
  StatMap,
  BONUSSTAT_KEY,
} from "@/shared/types"

import {
  buffCheckRegistry,
  buffCreationRegistry,
  buffMutationRegistry,
} from "@/simulation/resolver"

import {
  applyCooldown,
  getBonus,
  getDeepen,
  getDefMultiplier,
  getResMultiplier,
  isEventType,
  isExpired,
  isOnCastEvent,
  shouldEvaluate,
  shouldTrigger,
} from "./helper"
import { generateWarningMessage, insertTimelineEvent } from "@/lib/helper"

function removeExpiredBuffs(state: StateContext): StateContext {
  const { characterId } = state.action

  let newState = state

  const activeBuffs =
    state.activeBuffs.get(characterId) ?? new Map<string, BuffInstance>()
  const newBuffs = new Map(activeBuffs)
  for (const buff of activeBuffs.values()) {
    const shouldExpire =
      buff.onExpire?.conditions?.some((ref) => {
        const fn = buffCheckRegistry[ref]
        if (!fn) {
          console.log(`Missing buffCheckRegistry for ${ref}`)
          return
        }
        return fn(newState, buff, 0)
      }) ?? isExpired(newState, buff) // basic expiration fallback
    if (!shouldExpire) continue

    newBuffs.delete(buff.id)

    if (buff.onExpire?.effects) {
      for (const ref of buff.onExpire.effects) {
        const fn = buffMutationRegistry[ref]
        if (!fn) {
          console.log(`Missing buffMutationRegistry for ${ref}`)
          continue
        }
        newState = fn(newState, buff)
      }
    }
  }

  const newBuffsGlobal = new Map(state.activeBuffsGlobal)
  for (const buff of state.activeBuffsGlobal.values()) {
    const shouldExpire =
      buff.onExpire?.conditions?.some((ref) => {
        const fn = buffCheckRegistry[ref]
        if (!fn) {
          console.log(`Missing buffCheckRegistry for ${ref}`)
          return
        }
        return fn(newState, buff, 0)
      }) ?? isExpired(newState, buff) // basic expiration fallback
    if (!shouldExpire) continue

    newBuffsGlobal.delete(buff.id)

    if (buff.onExpire?.effects) {
      for (const ref of buff.onExpire.effects) {
        const fn = buffMutationRegistry[ref]
        if (!fn) {
          console.log(`Missing buffMutationRegistry for ${ref}`)
          continue
        }
        newState = fn(newState, buff)
      }
    }
  }

  const newBuffsEnemy = new Map(state.activeBuffsEnemy)
  for (const buff of state.activeBuffsGlobal.values()) {
    const shouldExpire =
      buff.onExpire?.conditions?.some((ref) => {
        const fn = buffCheckRegistry[ref]
        if (!fn) {
          console.log(`Missing buffCheckRegistry for ${ref}`)
          return
        }
        return fn(newState, buff, 0)
      }) ?? isExpired(newState, buff) // basic expiration fallback
    if (!shouldExpire) continue

    newBuffsEnemy.delete(buff.id)

    // if (buff.onExpire?.effects) {
    //   for (const ref of buff.onExpire.effects) {
    //     const fn = buffMutationRegistry[ref]
    //     if (!fn) {
    //       console.log(`Missing buffMutationRegistry for ${ref}`)
    //       continue
    //     }
    //     newState = fn(newState, buff)
    //   }
    // }
  }

  return {
    ...newState,
    activeBuffs: new Map(newState.activeBuffs).set(characterId, newBuffs),
    activeBuffsGlobal: newBuffsGlobal,
    activeBuffsEnemy: newBuffsEnemy,
  }
}

function handleEnergyShare(state: StateContext): StateContext {
  const { characterId: activeCharacterId, skill } = state.action
  const value = skill.resonance

  const newCharacters = new Map<CHARACTER_KEY, Character>()

  for (const [characterId, character] of state.characters) {
    const activeMultiplier = characterId === activeCharacterId ? 1 : 0.5

    newCharacters.set(characterId, {
      ...character,
      dCond: {
        ...character.dCond,
        resonance: character.dCond.resonance + value * activeMultiplier,
      },
    })
  }

  return {
    ...state,
    characters: newCharacters,
  }
}

function evaluateDCond(
  state: StateContext,
  action: TimelineEvent,
): StateContext {
  const characterId = action.characterId
  const character = state.characters.get(characterId)
  const skill = action.skill

  if (!character) return state

  const onCast = isOnCastEvent(state)

  // team resonance
  let newState = handleEnergyShare(state)

  const newCharacters = new Map(newState.characters)
  const newCharacter = newCharacters.get(characterId)
  if (!newCharacter) return newState

  // forte
  const rawForte =
    newCharacter.dCond.forte +
    skill.forte +
    (onCast ? (skill.onCast?.forte ?? 0) : 0)
  newState = generateWarningMessage(state, "Forte", rawForte)

  const rawForte2 =
    newCharacter.dCond.forte2 +
    skill.forte2 +
    (onCast ? (skill.onCast?.forte2 ?? 0) : 0)
  newState = generateWarningMessage(state, "Forte2", rawForte2)

  const forte = Math.max(rawForte, 0)
  const forte2 = Math.max(rawForte2, 0)

  // concerto
  const rawConcerto =
    newCharacter.dCond.concerto +
    skill.concerto +
    (onCast ? (skill.onCast?.concerto ?? 0) : 0)
  newState = generateWarningMessage(state, "Concerto", rawConcerto)

  const concerto = Math.max(rawConcerto, 0)

  // resonance
  let resonance =
    newCharacter.dCond.resonance + (onCast ? (skill.onCast?.forte ?? 0) : 0)
  if (action.index === 0 && skill.category === "liberation") {
    newState = generateWarningMessage(state, "Resonance Energy", resonance)

    resonance = Math.max(rawConcerto, 0)
  }

  return {
    ...newState,
    characters: newCharacters.set(characterId, {
      ...newCharacter,
      dCond: {
        forte,
        forte2,
        concerto,
        resonance,
      },
    }),
  }
}

function calculateDamage(state: StateContext) {
  const { characterId, skill } = state.action

  const char = state.characters.get(characterId)
  const statMap = state.statMap.get(characterId)

  if (!char || !statMap) return 0

  // character
  const characterLevel = 90
  const skillLevel = 10

  const scaling = state.action.skill.scaling ?? "atk"
  const scalingFlat = (scaling + "Flat") as BONUSSTAT_KEY
  const scalingBase =
    char[scaling] * (1 + statMap[scaling]) + char.bonusStats[scalingFlat]

  const skillMultiplier =
    skill.mv * getSkillLevel[skillLevel] * (1 + statMap.multiplier) +
    statMap.bonus
  const bonusMultiplier =
    1 + getBonus(statMap, skill.classifications) + statMap.all + statMap.allEle
  const deepenMultiplier =
    1 +
    getDeepen(statMap, skill.classifications) +
    statMap.allDeep +
    statMap.allEleDeep
  const crit = Math.min(statMap.crit, 1)
  const critDmg = statMap.critDmg
  const critMultiplier = 1 + crit * (critDmg - 1)

  // enemy
  const enemyLevel = 100
  const enemyResistance = 0.2
  const enemyDefense = 792 + 8 * enemyLevel
  const resDown = statMap.resIgnore
  const defDown = statMap.defIgnore
  const resMultiplier = getResMultiplier(enemyResistance, resDown)
  const enemyDefenseMultiplier = getDefMultiplier(
    characterLevel,
    enemyDefense,
    defDown,
  )

  const expectedDamage =
    scalingBase *
    skillMultiplier *
    bonusMultiplier *
    deepenMultiplier *
    critMultiplier *
    resMultiplier *
    enemyDefenseMultiplier

  // console.table({
  //   skill: skill.name,
  //   attack,
  //   mv: skillMultiplier,
  //   bonus: bonusMultiplier,
  //   deepen: deepenMultiplier,
  //   crit,
  //   critDmg,
  //   res: resMultiplier,
  //   def: enemyDefenseMultiplier,
  // })

  return expectedDamage
}

function calculateHeal(state: StateContext) {
  const { characterId, type, skill } = state.action
  if (type !== "heal") return 0

  const char = state.characters.get(characterId)
  if (!char) return 0

  const statMap = state.statMap.get(characterId) ?? baseStatMap
  const healBonusMultiplier = state.statMap.get(characterId)?.heal ?? 0

  const scaling = state.action.skill.scaling ?? "atk"
  const scalingFlat = (scaling + "Flat") as BONUSSTAT_KEY
  const scalingBase =
    char[scaling] * (1 + statMap[scaling]) + char.bonusStats[scalingFlat]

  const mv = skill.mv
  const flat = skill.flat ?? 0

  const expectedHeal = scalingBase * mv * (1 + healBonusMultiplier) + flat

  // console.table({
  //   attack,
  //   mv,
  //   bonus: healBonusMultiplier,
  //   flat,
  // })

  return expectedHeal
}

function calculateShield(state: StateContext) {
  const { characterId, type, skill } = state.action
  if (type !== "heal") return 0

  const char = state.characters.get(characterId)
  if (!char) return 0

  const statMap = state.statMap.get(characterId) ?? baseStatMap

  const attack = char.atk * (1 + statMap.atk) + char.bonusStats.atkFlat

  const mv = skill.mv
  const flat = skill.flat ?? 0

  const expectedShield = attack * mv + flat

  // console.table({
  //   attack,
  //   mv,
  //   bonus: healBonusMultiplier,
  //   flat,
  // })

  return expectedShield
}

function processEvent(
  state: StateContext,
  action: TimelineEvent,
  allBuffs: Map<string, BuffDefinition>,
): StateContext {
  const characterId = action.characterId
  const { time, ...rest } = action

  /* update new iteration */
  state.action = rest
  state.time = time
  state.onFieldChar = isOnCastEvent(state) ? characterId : state.onFieldChar

  // remove expired buffs
  state = removeExpiredBuffs(state)

  // add onSwap buffs
  for (const buffId of state.buffNext) {
    const buff = allBuffs.get(buffId)
    if (!buff || !buff?.onSwap) continue

    for (const ref of buff.onSwap.effects) {
      const fn = buffCreationRegistry[ref]
      if (!fn) {
        console.log(`Missing buffCreationRegistry for ${ref}`)
        continue
      }
      state = fn(state, buff)
    }
  }

  /* snapshot before evaluation */
  const readState = state
  let newState = state

  // add triggered buffs
  for (const buff of allBuffs.values()) {
    if (!shouldTrigger(readState, buff, buff.onTrigger.conditions || []))
      continue

    for (const ref of buff.onTrigger.effects) {
      const fn = buffCreationRegistry[ref]
      if (!fn) {
        console.log(`Missing buffEvaluationRegistry for ${ref}`)
        continue
      }
      newState = fn(newState, buff)
    }
  }

  // evaluate buffs
  const buffs =
    newState.activeBuffs.get(characterId) ?? new Map<string, BuffInstance>()
  for (const buff of buffs.values()) {
    if (!buff.onEvent) continue

    if (!shouldEvaluate(readState, buff, buff.onTrigger.conditions || []))
      continue

    for (const ref of buff.onEvent.effects) {
      const fn = buffMutationRegistry[ref]
      if (!fn) {
        console.log(`Missing buffMutationRegistry for ${ref}`)
        continue
      }
      // console.log(newState.row, buff.name, ref, fn(state, buff))
      newState = fn(newState, buff)
    }
    newState = applyCooldown(newState, buff)
  }

  // evaluate team buffs
  for (const buff of newState.activeBuffsGlobal.values()) {
    if (!buff.onEvent) continue

    if (!shouldEvaluate(readState, buff, buff.onTrigger.conditions || []))
      continue

    for (const ref of buff.onEvent.effects) {
      const fn = buffMutationRegistry[ref]
      if (!fn) {
        console.log(`Missing buffMutationRegistry for ${ref}`)
        continue
      }
      // console.log(newState.row, buff.name, ref, fn(state, buff))
      newState = fn(newState, buff)
    }

    newState = applyCooldown(newState, buff)
  }

  // update dCond
  newState = evaluateDCond(newState, action)

  state = newState
  return state
}

function getResult(state: StateContext): Result {
  const { row, time } = state
  const { characterId, type, index, skill, sourceEventId } = state.action

  const character = state.characters.get(characterId)

  const getBuffs =
    state.activeBuffs.get(characterId) ?? new Map<string, BuffInstance>()
  const resBuffs = [...getBuffs.values()].map((buff) => buff.name)
  const resBuffsGlobal = [...state.activeBuffsGlobal.values()].map(
    (buff) => buff.name,
  )
  const resBuffsEnemy = [...state.activeBuffsEnemy.values()].map(
    (buff) => buff.name,
  )

  const resStatMap = state.statMap.get(characterId) ?? baseStatMap

  const isHeal = isEventType(state, "heal")
  const isShield = isEventType(state, "shield")

  const resultObject: Result = {
    id: state.action.id,
    row,
    characterId,
    type,
    index,
    skill,
    time,
    forte: character?.dCond.forte ?? 0,
    concerto: character?.dCond.concerto ?? 0,
    resonance: character?.dCond.resonance ?? 0,
    damage: !isHeal && !isShield ? calculateDamage(state) : 0,
    proc: {
      heal: isHeal ? calculateHeal(state) : 0,
      shield: isShield ? calculateShield(state) : 0,
    },
    sourceEventId,
    buffs: resBuffs,
    buffsGlobal: resBuffsGlobal,
    buffsEnemy: resBuffsEnemy,
    statMap: { ...resStatMap },
    message: { ...state.message },
  }

  return resultObject
}

function getAllBuffs(characters: Map<CHARACTER_KEY, Character>) {
  const allBuffs = new Map<string, BuffDefinition>()

  for (const character of characters.values()) {
    const sequence = character.sequence

    // Character buffs
    const cBuffData = cBuffs[character.id]
    if (cBuffData) {
      for (const buff of cBuffData) {
        const sequenceRequirement = buff.sequenceReq ?? 0
        if (sequenceRequirement > sequence) continue

        allBuffs.set(buff.id, {
          ...buff,
          duration: buff.duration * 60,
          ...(buff.cooldown && {
            cooldown: buff.cooldown * 60,
          }),
          ...(buff.stackInterval && {
            stackInterval: buff.stackInterval * 60,
          }),
        } satisfies BuffDefinition)
      }
    }

    // Weapon buffs
    const weapon = character.weapon
    const wBuffData = wBuffs[weapon.name]

    if (wBuffData) {
      const rankIndex = Math.max(0, weapon.rank - 1)

      for (const buff of wBuffData) {
        allBuffs.set(buff.id, {
          ...buff,
          duration: buff.duration * 60,
          modifiers: buff.modifiers && [buff.modifiers[rankIndex] ?? []],
          target: {
            source: character.id,
            appliesTo: buff?.target?.appliesTo ?? character.id,
          },
          ...(buff.stackInterval && {
            stackInterval: buff.stackInterval * 60,
          }),
        })
      }
    }

    // Set buffs
    const echoSetId = character.echoSet[0]
    const sBuffData = sBuffs[echoSetId]

    if (sBuffData) {
      for (const buff of sBuffData) {
        allBuffs.set(buff.id, {
          ...buff,
          duration: buff.duration * 60,
          target: {
            source: character.id,
            appliesTo: buff?.target?.appliesTo ?? character.id,
          },
        })
      }
    }

    // Echo buffs
    const echoName = character.echo
    const eBuffData = eBuffs[echoName]

    if (eBuffData) {
      for (const buff of eBuffData) {
        allBuffs.set(buff.id, {
          ...buff,
          duration: buff.duration * 60,
          target: {
            source: character.id,
            appliesTo: buff?.target?.appliesTo ?? character.id,
          },
        })
      }
    }
  }

  return allBuffs
}

function getStatMap(
  characters: Map<CHARACTER_KEY, Character>,
  statMap: StatMap,
): Map<CHARACTER_KEY, StatMap> {
  const newStatMap = new Map<CHARACTER_KEY, StatMap>()

  for (const [characterId, character] of characters) {
    const personalStatMap: StatMap = { ...statMap }

    // Apply BonusStats
    for (const key of BONUSSTAT_KEYS) {
      if (key in personalStatMap) {
        const sharedKey = key as BONUSSTAT_KEY & BUFF_TYPE
        personalStatMap[sharedKey] += character.bonusStats[sharedKey]
      }
    }

    newStatMap.set(characterId, personalStatMap)
  }

  return newStatMap
}

function getContext(
  characters: Map<CHARACTER_KEY, Character>,
  statMap: Map<CHARACTER_KEY, StatMap>,
): StateContext {
  const action: Omit<TimelineEvent, "time"> = {
    id: String(0),
    characterId: "encore",
    type: "damage",
    index: 0,
    skill: {
      id: "",
      name: "",
      category: "intro",
      classifications: ["fusion", "intro"],
      frames: 92,
      mv: 0,
      forte: 0,
      forte2: 0,
      concerto: 0,
      resonance: 0,
    },
  }

  const activeBuffs = new Map<CHARACTER_KEY, Map<string, BuffInstance>>()
  for (const [characterId] of characters) {
    activeBuffs.set(characterId, new Map<string, BuffInstance>())
  }
  const activeBuffsGlobal = new Map<string, BuffInstance>()
  const activeBuffsEnemy = new Map<string, BuffInstance>()

  const buffDeferred = new Map<string, BuffInstance>()
  const buffNext = new Set<string>()

  const cooldowns = new Map<string, number>()

  const proc = { damage: 0, heal: 0, shield: 0 }

  return {
    action,
    activeBuffs,
    activeBuffsGlobal,
    activeBuffsEnemy,
    prevChar: "",
    onFieldChar: "",
    buffDeferred,
    buffNext,
    characters,
    cooldowns,
    procQueue: [],
    proc,
    statMap,
    row: 1,
    time: 0,
    message: { warning: new Map<string, string>() },
  }
}

export function simulate(
  characterData: Character[],
  actionList: TimelineEvent[],
): Result[] {
  const resultList: Result[] = []

  const characters = new Map<CHARACTER_KEY, Character>()
  characterData.forEach((character) => {
    characters.set(character.id, character)
  })

  // get Data
  const allBuffs = getAllBuffs(characters)
  console.log("allBuffs", allBuffs)

  const statMap = getStatMap(characters, baseStatMap)

  // global mutable context
  let state = getContext(characters, statMap)

  // calculation loop
  const timeline = [...actionList]
  while (timeline.length > 0) {
    const action = timeline.shift()!

    const nextState = processEvent(state, action, allBuffs)
    const result = getResult(nextState)
    resultList.push(result)

    while (nextState.procQueue.length > 0) {
      const event = nextState.procQueue.shift()!
      insertTimelineEvent(timeline, event)
    }
    // limit
    if (state.row === 300) break

    // reset for next iteration
    state = {
      ...nextState,
      prevChar: nextState.onFieldChar,
      proc: { heal: 0, shield: 0 },
      row: nextState.row + 1,
      procQueue: [],
      message: { warning: new Map<string, string>() },
    }
  }

  return resultList
}
