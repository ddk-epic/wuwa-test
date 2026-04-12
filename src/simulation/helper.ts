import {
  CATEGORY_KEYS,
  DCOND_KEYS,
  ELEMENT_KEYS,
} from "../definitions/constants"

import { baseStatMap, bonusToDeepen } from "../shared/maps"
import type {
  BUFF_TYPE,
  BuffDefinition,
  BuffInstance,
  CATEGORY,
  Character,
  DCOND_KEY,
  DEEPEN_KEY,
  ELEMENT,
  EventTypes,
  StateContext,
  StatMap,
  TimelineEvent,
} from "../shared/types"

// ============================================
// ================== UTILS ===================
// ============================================

// generic function inverter for rules
export function not<TState, TBuff>(
  rule: (state: TState, buff: TBuff) => boolean,
): (state: TState, buff: TBuff) => boolean {
  return (state, buff) => !rule(state, buff)
}

export function addArgs<TState, TBuff, TArgs extends any[]>(
  rule: (state: TState, buff: TBuff, ...args: TArgs) => boolean,
  ...args: TArgs
): (state: TState, buff: TBuff) => boolean {
  return (state, buff) => rule(state, buff, ...args)
}

export function hasUsesLeft(buff: BuffInstance): boolean {
  return buff.usesLeft > 0
}

export function addNewCooldown(
  cooldownMap: Map<string, number>,
  buffId: string,
  endTime: number,
): Map<string, number> {
  const existingCd = cooldownMap.get(buffId) ?? 0
  if (existingCd >= endTime) return cooldownMap

  return new Map(cooldownMap).set(buffId, endTime)
}

export function isDamageProc(type: EventTypes) {
  return type === "damage"
}

export function isDCondKey(key: BUFF_TYPE): key is DCOND_KEY {
  return (DCOND_KEYS as readonly string[]).includes(key)
}

// ============================================
// =============== BUFF CHECKS ================
// ============================================

// export function isAlreadyActive(
//   state: StateContext,
//   action: TimelineEvent,
//   buff: BuffDefinition,
// ): boolean {
//   const characterId = action.characterId
//   const activeBuffs = state.activeBuffs.get(characterId)
//   if (!activeBuffs) return false

//   return activeBuffs.has(buff.id)
// }

export function isExpired(state: StateContext, buff: BuffInstance): boolean {
  return buff.endTime <= state.time
}

export function isOnField(state: StateContext) {
  return state.onFieldChar === state.action.characterId
}

export function hasSwapped(state: StateContext) {
  return state.onFieldChar !== state.prevChar
}

export function isBuffSource(state: StateContext, buff: BuffDefinition) {
  return state.action.characterId === buff.source
}

export function isBuffTarget(
  state: StateContext,
  buff: BuffDefinition,
): boolean {
  return state.action.characterId === buff.appliesTo
}

export function isBuffGlobal(_state: StateContext, buff: BuffDefinition) {
  return buff.appliesTo === "all"
}

export function isAbility(state: StateContext, buff: BuffDefinition): boolean {
  const trigger = state.action.skill.id

  return !!buff.trigger?.ability?.includes(trigger)
}

export function isCategory(
  state: StateContext,
  buff: BuffDefinition,
  target: string | "buff" = "buff",
): boolean {
  const trigger = state.action.skill.category

  if (target === "buff") {
    return !!buff.trigger?.category?.includes(trigger)
  }

  return target === trigger
}

export function hasCondition(
  state: StateContext,
  buff: BuffDefinition,
  getBuffBy: "id" | "name" = "id",
) {
  const condition = buff.trigger?.condition
  if (!condition) return false

  if (getBuffBy === "id") {
    const buffs = state.activeBuffs.get(state.action.characterId)
    if (buffs && condition.some((c) => buffs.has(c))) return true

    const globalBuffs = state.activeBuffsGlobal
    if (condition.some((c) => globalBuffs.has(c))) return true
  }

  const buffs = state.activeBuffs.get(state.action.characterId)
  if (buffs && [...buffs].some(([_, b]) => condition.includes(b.name)))
    return true

  const globalBuffs = state.activeBuffsGlobal
  if ([...globalBuffs].some(([_, b]) => condition.includes(b.name))) return true

  return false
}

export function isOnCastEvent(state: StateContext): boolean {
  return state.action.type === "cast"
}

export function isOnHitEvent(state: StateContext): boolean {
  return state.action.type === "hit"
}

export function isOnCooldown(
  state: StateContext,
  buff: BuffDefinition,
): boolean {
  const cdEndTime = state.cooldowns.get(buff.id)

  if (!cdEndTime) return false

  return cdEndTime >= state.time
}

// ============================================
// =============== BUFF UTILS =================
// ============================================
export function addToBuffNext(
  state: StateContext,
  buff: BuffDefinition,
): StateContext {
  if (buff.appliesTo !== "next") return state

  // console.log(state.row, `add buff ${buff.name} to buffNext`)

  return {
    ...state,
    buffNext: new Set(state.buffNext).add(buff.id),
  }
}

export function addToBuffDeferred(
  state: StateContext,
  buff: BuffDefinition,
): StateContext {
  // console.log(state.row, `add buff ${buff.name} to buffDeferred`)

  return {
    ...state,
    buffDeferred: new Map<string, BuffDefinition>(state.buffDeferred).set(
      buff.id,
      buff,
    ),
  }
}

export function applyDCondFlat(
  state: StateContext,
  buff: BuffInstance,
): StateContext {
  if (!buff.modifiers) return state

  const { characterId } = state.action

  const character = state.characters.get(characterId)
  if (!character) return state
  const newCharacter = { ...character, dCond: { ...character.dCond } }

  for (const modifier of buff.modifiers) {
    if (isDCondKey(modifier.class)) {
      newCharacter.dCond[modifier.class] += modifier.value
    }
  }

  return {
    ...state,
    characters: new Map(state.characters).set(characterId, newCharacter),
  }
}

export function applyCooldown(
  state: StateContext,
  buff: BuffInstance,
): StateContext {
  if (isOnCooldown(state, buff)) return state

  const newCooldowns = new Map(state.cooldowns)

  // apply new cooldowns
  if (buff.cooldown) {
    newCooldowns.set(buff.id, state.time + buff.cooldown)
  }

  if (buff.stackInterval && buff.stackInterval > 0) {
    newCooldowns.set(buff.id, state.time + buff.stackInterval)
  }

  return {
    ...state,
    cooldowns: newCooldowns,
  }
}

export function getStacksFromBuff(state: StateContext, buffById: string) {
  const characterId = state.action.characterId

  const foundBuff = state.activeBuffs.get(characterId)?.get(buffById)
  if (!foundBuff) return

  return foundBuff.stacks ?? 0
}

export function addConsumeStacksToBuff(
  state: StateContext,
  buff: BuffInstance,
  consumeById: string[],
): StateContext {
  const { characterId } = state.action
  const activeBuffs =
    state.activeBuffs.get(characterId) ?? new Map<string, BuffInstance>()

  let stacks = 0

  for (const id of consumeById) {
    const foundBuff = activeBuffs.get(id)
    if (foundBuff) stacks++
  }

  const newBuff = {
    ...buff,
    stacks,
  }

  const newPersonalBuffs = new Map(activeBuffs)
  newPersonalBuffs.set(buff.id, newBuff)

  return {
    ...state,
    activeBuffs: new Map(state.activeBuffs).set(characterId, newPersonalBuffs),
  }
}

export function removeCondition(
  state: StateContext,
  buff: BuffDefinition,
): StateContext {
  const { characterId } = state.action

  const activeBuffs =
    state.activeBuffs.get(characterId) ?? new Map<string, BuffInstance>()
  const newPersonalBuffs = new Map(activeBuffs)
  const newGlobalBuffs = new Map(state.activeBuffsGlobal)

  const buffConditionId = buff.trigger?.condition
  if (!buffConditionId || buffConditionId.length === 0) return state

  let hasChanged = false

  for (const condition of buffConditionId) {
    if (newPersonalBuffs.has(condition)) {
      newPersonalBuffs.delete(condition)
      hasChanged = true
    }
    if (newGlobalBuffs.has(condition)) {
      newPersonalBuffs.delete(condition)
      hasChanged = true
    }
  }

  if (!hasChanged) return state

  return {
    ...state,
    activeBuffs: new Map(state.activeBuffs).set(characterId, newPersonalBuffs),
    activeBuffsGlobal: newGlobalBuffs,
  }
}

// ============================================
// ================ BUFF MAIN =================
// ============================================
// create
export function createBuff(
  state: StateContext,
  buff: BuffDefinition,
): StateContext {
  if (!buff.appliesTo) return state

  const { characterId } = state.action

  const activeBuffs =
    state.activeBuffs.get(characterId) ?? new Map<string, BuffInstance>()

  const existing = activeBuffs.get(buff.id)

  const newBuffInstance: BuffInstance = existing
    ? {
        ...existing,
        endTime: state.time + buff.duration, // refresh duration on re-trigger
      }
    : {
        ...buff,
        endTime: state.time + buff.duration,
        ...(buff.stackLimit && {
          stacks: 0,
        }),
        usesLeft: 1,
      }

  // console.log(state.row, `add buff ${buff.name}`)

  const newPersonalBuffs = new Map(activeBuffs)
  newPersonalBuffs.set(buff.id, newBuffInstance)

  return {
    ...state,
    activeBuffs: new Map(state.activeBuffs).set(characterId, newPersonalBuffs),
  }
}

export function createBuffNext(
  state: StateContext,
  buff: BuffDefinition,
): StateContext {
  if (buff.appliesTo !== "next") return state

  const { characterId } = state.action

  const activeBuffs =
    state.activeBuffs.get(characterId) ?? new Map<string, BuffInstance>()

  const existing = activeBuffs.get(buff.id)

  const buffInstance: BuffInstance = {
    ...buff,
    endTime: state.time + buff.duration, // refresh duration on re-trigger
    ...(buff.stackLimit && {
      stacks: Math.min(existing?.stacks ?? 0, buff.stackLimit),
    }),
    usesLeft: existing?.usesLeft ?? 1,
  }

  // remove buffNext entry
  const newBuffNext = new Set(state.buffNext)
  newBuffNext.delete(buff.id)

  // console.log(state.row, `add buff ${buff.name}`)

  const newPersonalBuffs = new Map(activeBuffs)
  newPersonalBuffs.set(buff.id, buffInstance)

  return {
    ...state,
    activeBuffs: new Map(state.activeBuffs).set(characterId, newPersonalBuffs),
    buffNext: newBuffNext,
  }
}

export function createGlobalBuffNext(
  state: StateContext,
  buff: BuffDefinition,
): StateContext {
  if (buff.appliesTo !== "next") return state

  const existing = state.activeBuffsGlobal.get(buff.id)

  const buffInstance: BuffInstance = {
    ...buff,
    endTime: state.time + buff.duration, // refresh duration on re-trigger
    ...(buff.stackLimit && {
      stacks: Math.min(existing?.stacks ?? 0, buff.stackLimit),
    }),
    usesLeft: existing?.usesLeft ?? 1,
  }

  // remove buffNext entry
  const newBuffNext = new Set(state.buffNext)
  newBuffNext.delete(buff.id)

  return {
    ...state,
    activeBuffsGlobal: new Map(state.activeBuffsGlobal).set(
      buff.id,
      buffInstance,
    ),
    buffNext: newBuffNext,
  }
}

export function createGlobalBuff(
  state: StateContext,
  buff: BuffDefinition,
): StateContext {
  const activeBuffsGlobal = state.activeBuffsGlobal

  const existing = activeBuffsGlobal.get(buff.id)

  const newBuffInstance: BuffInstance = existing
    ? {
        ...existing,
        endTime: state.time + buff.duration, // refresh duration on re-trigger
      }
    : {
        ...buff,
        endTime: state.time + buff.duration,
        ...(buff.stackLimit && {
          stacks: 0,
        }),
        usesLeft: 1,
      }

  // console.log(state.row, `add buff ${buff.name}`)

  return {
    ...state,
    activeBuffsGlobal: new Map(activeBuffsGlobal).set(buff.id, newBuffInstance),
  }
}

// apply
function applyBuffStatChangesToCharacter(
  state: StateContext,
  character: Character,
  buff: BuffInstance,
): StateContext {
  if (buff.usesLeft <= 0) return state
  if (!buff.modifiers) return state

  const characterId = character.id
  const newCharacter = { ...character, dCond: { ...character.dCond } }

  // decrement buff uses
  const newBuff: BuffInstance = {
    ...buff,
    usesLeft: Math.max(buff.usesLeft - 1, 0),
  }

  // update stats
  const personalStatMap = state.statMap.get(characterId) ?? { ...baseStatMap }
  const newPersonalStatMap = { ...personalStatMap }

  for (const modifier of buff.modifiers) {
    if (modifier.concerto) newCharacter.dCond.concerto += modifier.concerto
    if (modifier.resonance) newCharacter.dCond.resonance += modifier.resonance

    newPersonalStatMap[modifier.class] += modifier.value
  }

  // add to the correct buff column
  const isGlobal = buff.appliesTo === "all"

  const newPersonalBuffs = new Map(state.activeBuffs.get(characterId))
  newPersonalBuffs.set(buff.id, newBuff)
  const newBuffs = new Map(state.activeBuffs).set(characterId, newPersonalBuffs)
  const newGlobalBuffs = new Map(state.activeBuffsGlobal).set(buff.id, newBuff)

  return {
    ...state,
    characters: new Map(state.characters).set(characterId, newCharacter),
    activeBuffs: !isGlobal ? newBuffs : state.activeBuffs,
    activeBuffsGlobal: isGlobal ? newGlobalBuffs : state.activeBuffsGlobal,
    statMap: new Map(state.statMap).set(characterId, newPersonalStatMap),
  }
}

export function applyBuffStatChanges(
  state: StateContext,
  buff: BuffInstance,
): StateContext {
  const character = state.characters.get(state.action.characterId)
  if (!character) return state

  return applyBuffStatChangesToCharacter(state, character, buff)
}

export function applyGlobalBuffStatChanges(
  state: StateContext,
  buff: BuffInstance,
): StateContext {
  let newState = state
  for (const character of state.characters.values()) {
    newState = applyBuffStatChangesToCharacter(newState, character, buff)
  }
  return newState
}

// remove
function removeBuffStatChangesFromCharacter(
  state: StateContext,
  character: Character,
  buff: BuffInstance,
): StateContext {
  if (!buff.modifiers) return state

  const characterId = character.id

  const personalBuffs = state.activeBuffs.get(characterId)
  if (!personalBuffs) return state

  const existing = personalBuffs.get(buff.id)
  if (!existing) return state

  const personalStatMap = state.statMap.get(characterId) ?? { ...baseStatMap }
  const newPersonalStatMap = { ...personalStatMap }

  for (const modifier of buff.modifiers) {
    newPersonalStatMap[modifier.class] = Math.max(
      newPersonalStatMap[modifier.class] - modifier.value, // clamp to >= 0
      0,
    )
  }

  return {
    ...state,
    statMap: new Map(state.statMap).set(characterId, newPersonalStatMap),
  }
}

export function removeBuffStatChanges(
  state: StateContext,
  buff: BuffInstance,
): StateContext {
  const character = state.characters.get(state.action.characterId)
  if (!character) return state

  return removeBuffStatChangesFromCharacter(state, character, buff)
}

export function removeGlobalBuffStatChanges(
  state: StateContext,
  buff: BuffInstance,
): StateContext {
  let newState = state
  for (const character of state.characters.values()) {
    newState = removeBuffStatChangesFromCharacter(state, character, buff)
  }
  return newState
}

// stacking
function setStackingBuffStacks(
  state: StateContext,
  character: Character,
  buff: BuffInstance,
  targetStacks: number,
): StateContext {
  if (!buff.modifiers || !buff.stackLimit) return state

  const characterId = character.id

  const personalBuffs = state.activeBuffs.get(characterId)
  if (!personalBuffs) return state

  const existing = personalBuffs.get(buff.id)
  const currentStacks = existing?.stacks ?? 0

  // clamp to valid range
  const clampedStacks = Math.max(0, Math.min(targetStacks, buff.stackLimit))
  const stackDelta = clampedStacks - currentStacks

  const personalStatMap = state.statMap.get(characterId) ?? { ...baseStatMap }
  const newPersonalStatMap = { ...personalStatMap }

  for (const modifier of buff.modifiers) {
    newPersonalStatMap[modifier.class] += modifier.value * stackDelta
  }

  const newBuff = {
    ...(existing ?? buff),
    stacks: clampedStacks,
    name: `${buff.id} x${clampedStacks}`,
    endTime: state.time + buff.duration,
  }

  // add to the correct buff column
  const isGlobal = buff.appliesTo === "all"

  const newBuffs = new Map(state.activeBuffs).set(
    characterId,
    new Map(personalBuffs).set(buff.id, newBuff),
  )
  const newGlobalBuffs = new Map(state.activeBuffsGlobal).set(buff.id, newBuff)

  return {
    ...state,
    activeBuffs: !isGlobal ? newBuffs : state.activeBuffs,
    activeBuffsGlobal: isGlobal ? newGlobalBuffs : state.activeBuffsGlobal,
    statMap: new Map(state.statMap).set(characterId, newPersonalStatMap),
  }
}

export function applyStackingBuffStatChanges(
  state: StateContext,
  buff: BuffInstance,
  stacksToAdd: number = 1,
): StateContext {
  if (state.action.type === "cast") return state

  const character = state.characters.get(state.action.characterId)
  if (!character) return state

  const personalBuffs = state.activeBuffs.get(character.id)
  const existing = personalBuffs?.get(buff.id)
  const currentStacks = existing?.stacks ?? 0

  return setStackingBuffStacks(
    state,
    character,
    buff,
    currentStacks + stacksToAdd,
  )
}

export function applyGlobalStackingBuffStatChanges(
  state: StateContext,
  buff: BuffInstance,
  stacksToAdd: number = 1,
): StateContext {
  let newState = state

  for (const character of state.characters.values()) {
    const personalBuffs = newState.activeBuffs.get(character.id)
    const existing = personalBuffs?.get(buff.id)
    const currentStacks = existing?.stacks ?? 0

    newState = setStackingBuffStacks(
      newState,
      character,
      buff,
      currentStacks + stacksToAdd,
    )
  }

  return newState
}

export function removeStackingBuffStatChanges(
  state: StateContext,
  buff: BuffInstance,
  stacksToRemove: number = 1,
): StateContext {
  const { characterId } = state.action
  const character = state.characters.get(characterId)
  if (!character) return state

  const personalBuffs = state.activeBuffs.get(characterId)
  const existing = personalBuffs?.get(buff.id)
  const currentStacks = existing?.stacks ?? 0

  return setStackingBuffStacks(
    state,
    character,
    buff,
    currentStacks - stacksToRemove,
  )
}

export function removeGlobalStackingBuffStatChanges(
  state: StateContext,
  buff: BuffInstance,
  stacksToRemove: number = 1,
): StateContext {
  let newState = state
  for (const character of state.characters.values()) {
    const personalBuffs = newState.activeBuffs.get(character.id)
    const existing = personalBuffs?.get(buff.id)
    const currentStacks = existing?.stacks ?? 0

    newState = setStackingBuffStacks(
      newState,
      character,
      buff,
      currentStacks - stacksToRemove,
    )
  }
  return newState
}

// other
export function updateBuffIdentity(
  state: StateContext,
  buff: BuffDefinition,
  buffToBeConsumedId: string,
): StateContext {
  const { characterId } = state.action

  const activeBuffs =
    state.activeBuffs.get(characterId) ?? new Map<string, BuffInstance>()

  const existing = activeBuffs.get(buffToBeConsumedId)
  if (!existing) return state

  const newBuffInstance: BuffInstance = {
    ...existing,
    id: buff.id,
    name: buff.name,
    endTime: state.time + buff.duration, // refresh duration on re-trigger
    usesLeft: 1,
  }

  const newCooldowns = addNewCooldown(
    state.cooldowns,
    existing.id,
    state.time + buff.duration,
  )

  const newPersonalBuffs = new Map(activeBuffs)
  newPersonalBuffs.delete(existing.id)
  newPersonalBuffs.set(buff.id, newBuffInstance)

  return {
    ...state,
    activeBuffs: new Map(state.activeBuffs).set(characterId, newPersonalBuffs),
    cooldowns: newCooldowns,
  }
}

export function addDamageToTimeline(
  state: StateContext,
  buff: BuffInstance,
  consumeById: string[],
): StateContext {
  if (!buff.appliesTo) return state

  const { characterId } = state.action

  const newActiveBuffs =
    state.activeBuffs.get(characterId) ?? new Map<string, BuffInstance>()

  const toConsume: BuffInstance[] = []

  for (const id of consumeById) {
    const foundBuff = newActiveBuffs.get(id)
    if (foundBuff) {
      toConsume.push(foundBuff)
    }
  }

  const newQueuedEvents: TimelineEvent[] = [...state.procQueue]

  for (const buffToBeConsumed of toConsume) {
    if (!buffToBeConsumed.modifiers) continue

    const mod = buffToBeConsumed.modifiers[0]
    const { skill } = state.action

    const procEvent: TimelineEvent = {
      characterId,
      type: "damage",
      skill: {
        id: buffToBeConsumed.id,
        name: `Proc: ${buffToBeConsumed.id}`,
        category: skill.category,
        classifications: buffToBeConsumed.classifications ?? [],
        mv: mod.value,
        frames: 0,
        hits: 1,
        forte: mod.forte ?? 0,
        forte2: mod.forte2 ?? 0,
        concerto: mod.concerto ?? 0,
        resonance: mod.resonance ?? 0,
      },
      time: state.time,
      parent: String(state.lastCastRow),
    }

    newQueuedEvents.push(procEvent)
  }

  for (const buffToBeConsumed of toConsume) {
    newActiveBuffs.delete(buffToBeConsumed.id)
  }

  return {
    ...state,
    activeBuffs: new Map(state.activeBuffs).set(characterId, newActiveBuffs),
    procQueue: newQueuedEvents,
  }
}

// ============================================
// =========== DAMAGE CALCULATION =============
// ============================================

export function getBonus(
  statMap: StatMap,
  classifications: BUFF_TYPE[],
): number {
  let result = 0

  const bonusKeys = classifications.filter(
    (key): key is CATEGORY | ELEMENT =>
      (CATEGORY_KEYS as readonly string[]).includes(key) ||
      (ELEMENT_KEYS as readonly string[]).includes(key),
  )

  for (const key of bonusKeys) {
    result += statMap[key]
  }

  return result
}

export function getDeepen(
  statMap: StatMap,
  classifications: BUFF_TYPE[],
): number {
  let result = 0

  const bonusKeys = classifications.filter(
    (key): key is CATEGORY | ELEMENT =>
      (CATEGORY_KEYS as readonly string[]).includes(key) ||
      (ELEMENT_KEYS as readonly string[]).includes(key),
  )

  for (const key of bonusKeys) {
    const deepenKey = bonusToDeepen[key] as DEEPEN_KEY
    result += statMap[deepenKey]
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
