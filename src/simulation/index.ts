import { BONUSSTAT_KEYS } from "@/definitions/constants"

import buffs from "@/definitions/buffs/characters"
import weaponBuffs from "@/definitions/buffs/weapon"
import setBuffs from "@/definitions/buffs/echo-set"
import echoBuffs from "@/definitions/buffs/echoes"

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

import buffHandler from "@/simulation/resolver"

import {
  applyCooldown,
  getBonus,
  getDeepen,
  getDefMultiplier,
  getResMultiplier,
  hasSwapped,
} from "./helper"

function removeExpiredBuffs(state: StateContext): StateContext {
  const { characterId } = state.action
  const activeBuffs =
    state.activeBuffs.get(characterId) ?? new Map<string, BuffInstance>()
  const activeBuffsGlobal = state.activeBuffsGlobal

  const newBuffs = new Map(activeBuffs)
  const newBuffsGlobal = new Map(activeBuffsGlobal)

  function shouldRemoveBuff(state: StateContext, buff: BuffInstance): boolean {
    // expiration
    if (buff.endTime <= state.time) return true
    // outro buffs
    if (buff.appliesTo === "next" && hasSwapped(state)) return true

    return false
  }

  const expiredBuffs: BuffInstance[] = []

  // remove expired buffs
  for (const buff of activeBuffs.values()) {
    if (shouldRemoveBuff(state, buff)) {
      expiredBuffs.push(buff)
      newBuffs.delete(buff.id)
    }
  }

  for (const buff of activeBuffsGlobal.values()) {
    if (shouldRemoveBuff(state, buff)) {
      expiredBuffs.push(buff)
      newBuffsGlobal.delete(buff.id)
    }
  }

  // update stat changes after removal
  let newState = state
  for (const buff of expiredBuffs) {
    const buffToUpdate = buffHandler[buff.id]
    if (!buffToUpdate.onExpire) continue
    newState = buffToUpdate.onExpire(newState, buff)
  }

  return {
    ...newState,
    activeBuffs: new Map(newState.activeBuffs).set(characterId, newBuffs),
    activeBuffsGlobal: newBuffsGlobal,
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

  let newState = handleEnergyShare(state)

  const newCharacters = new Map(newState.characters)
  const newCharacter = newCharacters.get(characterId)

  if (!newCharacter) return newState

  // resonance reset
  let resonance = newCharacter.dCond.resonance
  if (action.type === "cast" && skill.category === "liberation") {
    resonance = 0
  }

  newCharacters.set(characterId, {
    ...newCharacter,
    dCond: {
      ...newCharacter.dCond,
      resonance,
      concerto: newCharacter.dCond.concerto + skill.concerto,
    },
  })

  return {
    ...newState,
    characters: newCharacters,
  }
}

function calculateDamage(
  state: StateContext,
  action: TimelineEvent | Omit<TimelineEvent, "time">,
) {
  const { characterId, type, skill } = action
  if (type === "cast") return 0

  const char = state.characters.get(characterId)
  const statMap = state.statMap.get(characterId)

  if (!char || !statMap) return 0

  // character
  const characterLevel = 90
  const skillLevel = 10
  const attack = char.atk * (1 + statMap.atk) + char.bonusStats.atkFlat
  const skillMultiplier =
    skill.mv * getSkillLevel[skillLevel] * (1 + statMap.multiplier)
  const bonusMultiplier =
    1 + getBonus(statMap, skill.classifications) + statMap.bonus
  const deepenMultiplier = 1 + getDeepen(statMap, skill.classifications)
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
    attack *
    skillMultiplier *
    bonusMultiplier *
    deepenMultiplier *
    critMultiplier *
    resMultiplier *
    enemyDefenseMultiplier

  // console.table({
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

function processEvent(
  state: StateContext,
  action: TimelineEvent,
  allBuffs: Map<string, BuffDefinition>,
): StateContext {
  const characterId = action.characterId
  const { time, ...rest } = action

  state.action = rest
  state.time = time

  state.onFieldChar = action.type === "cast" ? characterId : state.onFieldChar

  // remove expired buffs
  state = removeExpiredBuffs(state)

  // add onSwap buffs
  for (const buffId of state.buffNext) {
    const buffToAdd = buffHandler[buffId]
    const buff = allBuffs.get(buffId)
    if (!buffToAdd.onSwap || !buff) continue

    state = buffToAdd.onSwap(state, buff)
  }

  // add triggered buffs
  for (const buff of allBuffs.values()) {
    const buffToAdd = buffHandler[buff.id]
    if (!buffToAdd) continue

    state = buffToAdd.onTrigger(state, buff)
  }

  // evaluate buffs
  const buffs =
    state.activeBuffs.get(characterId) ?? new Map<string, BuffInstance>()
  for (const buff of buffs.values()) {
    const buffToCheck = buffHandler[buff.id]
    if (!buffToCheck) continue

    if (action.type === "hit") {
      if (!buffToCheck.onHit) continue
      state = buffToCheck.onHit(state, buff)
    } else {
      if (!buffToCheck.onCast) continue
      state = buffToCheck.onCast(state, buff)
    }

    state = applyCooldown(state, buff)
  }

  // evaluate team buffs
  const buffsGlobal = state.activeBuffsGlobal
  for (const buff of buffsGlobal.values()) {
    const buffToCheck = buffHandler[buff.id]
    if (!buffToCheck) continue

    if (action.type === "hit") {
      if (!buffToCheck.onHit) continue
      state = buffToCheck.onHit(state, buff)
    } else {
      if (!buffToCheck.onCast) continue
      state = buffToCheck.onCast(state, buff)
    }

    state = applyCooldown(state, buff)
  }

  // update dCond
  state = evaluateDCond(state, action)

  // evaluate queued proc events
  while (state.procQueue.length > 0) {
    const event = state.procQueue[0]
    const damage = calculateDamage(state, event)

    state = {
      ...state,
      procQueue: state.procQueue.slice(1),
      proc: {
        ...state.proc,
        damage: state.proc.damage + damage,
      },
    }

    // console.log(state.row, event.skill.name)
  }
  state = { ...state, procQueue: [] }

  return state
}

function getResult(state: StateContext): Result {
  const { characterId, type, skill, parent } = state.action

  const getBuffs =
    state.activeBuffs.get(characterId) ?? new Map<string, BuffInstance>()
  const resBuffs = [...getBuffs.values()].map((buff) => buff.name)
  const resBuffsGlobal = [...state.activeBuffsGlobal.values()].map(
    (buff) => buff.name,
  )

  const resStatMap = state.statMap.get(characterId) ?? baseStatMap

  const resultObject: Result = {
    row: state.row,
    characterId,
    type,
    skill,
    time: state.time,
    concerto: state.characters.get(characterId)?.dCond.concerto ?? 0,
    resonance: state.characters.get(characterId)?.dCond.resonance ?? 0,
    damage: calculateDamage(state, state.action),
    proc: { ...state.proc },
    parent,
    buffs: resBuffs,
    buffsGlobal: resBuffsGlobal,
    statMap: { ...resStatMap },
    message: {},
  }

  return resultObject
}

function getAllBuffs(characters: Map<CHARACTER_KEY, Character>) {
  const allBuffs = new Map<string, BuffDefinition>()

  for (const character of characters.values()) {
    const sequence = character.sequence

    // Character buffs
    const cBuffData = buffs[character.id]
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
        } satisfies BuffDefinition)
      }
    }

    // Weapon buffs
    const weapon = character.weapon
    const wBuffData = weaponBuffs[weapon.name]

    if (wBuffData) {
      const rankIndex = Math.max(0, weapon.rank - 1)

      for (const buff of wBuffData) {
        allBuffs.set(buff.id, {
          ...buff,
          duration: buff.duration * 60,
          modifiers: buff.modifiers && [buff.modifiers[rankIndex] ?? []],
          appliesTo: character.id,
          source: character.id,
        })
      }
    }

    // Set buffs
    const echoSetId = character.echoSet[0]
    const sBuffData = setBuffs[echoSetId]

    if (sBuffData) {
      for (const buff of sBuffData) {
        allBuffs.set(buff.id, {
          ...buff,
          duration: buff.duration * 60,
          source: character.id,
          appliesTo: buff.appliesTo ?? character.id,
        })
      }
    }

    // Echo buffs
    const echoName = character.echo
    const eBuffData = echoBuffs[echoName]

    if (eBuffData) {
      for (const buff of eBuffData) {
        allBuffs.set(buff.id, {
          ...buff,
          duration: buff.duration * 60,
          source: character.id,
          appliesTo: buff.appliesTo ?? character.id,
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
    console.log(character.id,character.bonusStats)

    newStatMap.set(characterId, personalStatMap)
  }

  return newStatMap
}

function getContext(
  characters: Map<CHARACTER_KEY, Character>,
  statMap: Map<CHARACTER_KEY, StatMap>,
): StateContext {
  const action: Omit<TimelineEvent, "time"> = {
    characterId: "encore",
    type: "cast",
    skill: {
      id: "",
      name: "",
      category: "intro",
      classifications: ["fusion", "intro"],
      frames: 92,
      mv: 0,
      hits: 0,
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

  const buffDeferred = new Map<string, BuffInstance>()
  const buffNext = new Set<string>()

  const cooldowns = new Map<string, number>()

  const proc = { damage: 0, heal: 0, shield: 0 }

  return {
    action,
    activeBuffs,
    activeBuffsGlobal,
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
    message: {},
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
  for (const action of actionList) {
    state = processEvent(state, action, allBuffs)
    const result = getResult(state)

    // setup for next iteration
    state.prevChar = state.onFieldChar
    state.proc = { damage: 0, heal: 0, shield: 0 }
    state.row += 1

    resultList.push(result)
  }
  return resultList
}
