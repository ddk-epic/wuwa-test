import type {
  BUFF_TYPE,
  BuffDefinition,
  BuffInstance,
  CATEGORY,
  Character,
  DCOND_KEY,
  DEEPEN_KEY,
  ELEMENT,
  EventType,
  ModifierValue,
  StateContext,
  StatMap,
  TimelineEvent,
} from "../shared/types"
import { baseStatMap, bonusToDeepen } from "../shared/maps"

import {
  CATEGORY_KEYS,
  DCOND_KEYS,
  ELEMENT_KEYS,
} from "../definitions/constants"

// ============================================
// ================== UTILS ===================
// ============================================

// generic functions
export function not<TState, TBuff>(
  rule: (state: TState, buff: TBuff) => boolean,
): (state: TState, buff: TBuff) => boolean {
  return (state, buff) => !rule(state, buff)
}

export function or<TState, TBuff>(
  ...rules: Array<(state: TState, buff: TBuff) => boolean>
): (state: TState, buff: TBuff) => boolean {
  return (state, buff) => rules.some((rule) => rule(state, buff))
}

export function withArgs<TState, TBuff, TArgs extends any[]>(
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

export function isDCondKey(key: BUFF_TYPE): key is DCOND_KEY {
  return (DCOND_KEYS as readonly string[]).includes(key)
}

export function isEventType(state: StateContext, type: EventType): boolean {
  return state.action.type === type
}

export function isExpired(state: StateContext, buff: BuffInstance): boolean {
  return buff.endTime <= state.time
}

export function shouldTrigger(
  state: StateContext,
  buff: BuffDefinition,
  triggerRules: ((
    state: StateContext,
    buff: BuffDefinition,
    triggerIndex: number,
  ) => boolean)[],
): boolean {
  if (!triggerRules?.length) return true // if no rules, allow

  for (let i = 0; i < triggerRules.length; i++) {
    // console.log(
    //   state.row,
    //   buff.name,
    //   triggerRules.map((rule) => rule(state, buff, i)),
    // )
    if (triggerRules.every((rule) => rule(state, buff, i))) {
      return true
    }
  }

  return false
}

// ============================================
// =============== BUFF CHECKS ================
// ============================================

// state side
export function isOnField(state: StateContext): boolean {
  return state.onFieldChar === state.action.characterId
}

export function hasSwapped(state: StateContext): boolean {
  return state.onFieldChar !== state.prevChar
}

export function isOnCastEvent(state: StateContext): boolean {
  return state.action.index === 0
}

export function isOnHitEvent(state: StateContext): boolean {
  return state.action.type === "damage" && state.action.index > 0
}

export function isHealEvent(state: StateContext): boolean {
  return state.action.type === "heal"
}

// buff getters
export function getBuffById(
  state: StateContext,
  buffId: string,
): BuffInstance | undefined {
  for (const [characterId] of state.characters) {
    const buff = state.activeBuffs.get(characterId)?.get(buffId)
    if (buff) return buff
  }

  return state.activeBuffsGlobal.get(buffId)
}

export function getEnemyBuffById(
  state: StateContext,
  buffId: string,
): BuffInstance | undefined {
  const existing = state.activeBuffsEnemy.get(buffId)

  return existing
}

export function isAbilityOrCategory(
  state: StateContext,
  buff: BuffDefinition,
  target: string,
): boolean {
  if (!buff.trigger || buff.trigger.length === 0) return false

  const ability = state.action.skill.id === target
  const category = state.action.skill.category === target

  return ability || category
}

// buff checks
export function isOnCooldown(
  state: StateContext,
  buff: BuffDefinition,
): boolean {
  const cdEndTime = state.cooldowns.get(buff.id)
  if (!cdEndTime) return false

  return cdEndTime >= state.time
}

export function isBuffSource(
  state: StateContext,
  buff: BuffDefinition,
): boolean {
  return state.action.characterId === buff.source
}

export function isBuffTarget(
  state: StateContext,
  buff: BuffDefinition,
): boolean {
  return state.action.characterId === buff.appliesTo
}

export function isBuffGlobal(
  _state: StateContext,
  buff: BuffDefinition,
): boolean {
  return buff.appliesTo === "all"
}

export function isIndex(
  state: StateContext,
  buff: BuffDefinition,
  triggerIndex: number = 0,
): boolean {
  return buff.trigger?.[triggerIndex]?.index === state.action.index
}

export function isAbility(
  state: StateContext,
  buff: BuffDefinition,
  triggerIndex: number = 0,
): boolean {
  return buff.trigger?.[triggerIndex]?.ability === state.action.skill.id
}

export function isCategory(
  state: StateContext,
  buff: BuffDefinition,
  triggerIndex: number = 0,
): boolean {
  return buff.trigger?.[triggerIndex]?.category === state.action.skill.category
}

export function hasConditionById(
  state: StateContext,
  buff: BuffDefinition,
  triggerIndex: number = 0,
): boolean {
  const condition = buff.trigger?.[triggerIndex]?.condition ?? ""

  const buffs = state.activeBuffs.get(state.action.characterId)
  if (buffs && buffs.has(condition)) return true

  const globalBuffs = state.activeBuffsGlobal
  if (globalBuffs.has(condition)) return true

  return false
}

export function hasConditionByName(
  state: StateContext,
  buff: BuffDefinition,
  triggerIndex: number = 0,
): boolean {
  const condition = buff.trigger?.[triggerIndex]?.condition ?? ""

  const buffs = state.activeBuffs.get(state.action.characterId)
  if (buffs && [...buffs].some(([_, b]) => b.name === condition)) return true

  const globalBuffs = state.activeBuffsGlobal
  if ([...globalBuffs].some(([_, b]) => b.name === condition)) return true

  return false
}

export function enemyConditionById(
  state: StateContext,
  buff: BuffDefinition,
  triggerIndex: number = 0,
): boolean {
  const condition = buff.trigger?.[triggerIndex]?.condition ?? ""

  const enemyBuffs = state.activeBuffsEnemy
  if (enemyBuffs.has(condition)) return true

  return false
}

export function enemyConditionByName(
  state: StateContext,
  buff: BuffDefinition,
  triggerIndex: number = 0,
): boolean {
  const condition = buff.trigger?.[triggerIndex]?.condition ?? ""

  const enemyBuffs = state.activeBuffsEnemy
  if ([...enemyBuffs].some(([_, b]) => b.name === condition)) return true

  return false
}

// ============================================
// =============== BUFF UTILS =================
// ============================================

export function getStacksFromBuff(
  state: StateContext,
  buffById: string,
): number {
  const { characterId } = state.action

  const existing = state.activeBuffs.get(characterId)?.get(buffById)

  return existing?.stacks ?? 0
}

export function getStacksFromStatReq(
  state: StateContext,
  buff: BuffDefinition | BuffInstance,
): number {
  const characterId = buff.source
  if (!characterId) return 0

  const statReq = buff.modifiers?.[0].statReq
  const stepValue = buff.modifiers?.[0].stepValue
  if (!statReq || !stepValue) return 0

  const statReqValue = state.statMap.get(characterId)?.[statReq]
  if (!statReqValue) return 0

  const existing = isBuffGlobal(state, buff)
    ? state.activeBuffsGlobal.get(buff.id)
    : state.activeBuffs.get(characterId)?.get(buff.id)
  const currStacks = existing?.stacks ?? 0

  const newStacks = Math.floor(statReqValue / stepValue)
  return newStacks - currStacks
}

export function handleBuffInstance(
  state: StateContext,
  buff: BuffDefinition,
  existing: BuffInstance | undefined,
  withEndTime?: number,
): BuffInstance {
  const newBuffInstance: BuffInstance = existing
    ? {
        ...existing,
        endTime: state.time + buff.duration, // refresh duration on re-trigger
      }
    : {
        ...buff,
        endTime: withEndTime ? withEndTime : state.time + buff.duration, // copy duration or refresh
        ...(buff.stackLimit && {
          stacks: 0,
        }),
        usesLeft: 1,
        sourceEventId: state.action.id,
      }
  return newBuffInstance
}

export function addToBuffNext(
  state: StateContext,
  buff: BuffDefinition,
): StateContext {
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

export function applyCooldown(
  state: StateContext,
  buff: BuffDefinition | BuffInstance,
): StateContext {
  if (isOnCooldown(state, buff)) return state
  if (!buff.cooldown && !buff.stackInterval) return state

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

export function addNewTimelineEvent(
  state: StateContext,
  buff: BuffDefinition,
  mod: ModifierValue,
  index: number,
  sourceEventId: string,
): TimelineEvent {
  const type = mod.type ?? "damage"

  const newEvent: TimelineEvent = {
    id: String(state.row) + type,
    characterId: buff.source ?? "encore",
    type,
    index,
    skill: {
      id: buff.id,
      name: `Proc: ${buff.id} [${type}]`,
      category: "basic",
      classifications: buff.classifications ?? [],
      mv: mod.value,
      frames: mod.frame ?? 0,
      forte: mod.forte ?? 0,
      forte2: mod.forte2 ?? 0,
      concerto: mod.concerto ?? 0,
      resonance: mod.resonance ?? 0,
      ...(mod.scaling && { scaling: mod.scaling }),
      ...(mod.flat && { flat: mod.flat }),
    },
    time: state.time + (mod.frame ?? 0),
    sourceEventId,
  }

  return newEvent
}

export function removeCondition(
  state: StateContext,
  buff: BuffDefinition,
): StateContext {
  const { characterId } = state.action

  const conditions =
    buff.trigger?.flatMap((t) =>
      typeof t.condition === "string" ? [t.condition] : [],
    ) ?? []
  if (!conditions?.length) return state

  for (const condition of conditions) {
    // personal
    if (state.activeBuffs.get(characterId)?.has(condition)) {
      const newPersonalBuffs = new Map(state.activeBuffs.get(characterId))
      newPersonalBuffs.delete(condition)

      return {
        ...state,
        activeBuffs: new Map(state.activeBuffs).set(
          characterId,
          newPersonalBuffs,
        ),
      }
    }

    //global
    if (state.activeBuffsGlobal.has(condition)) {
      const newGlobalBuffs = new Map(state.activeBuffsGlobal)
      newGlobalBuffs.delete(condition)

      return {
        ...state,
        activeBuffsGlobal: newGlobalBuffs,
      }
    }
  }

  return state
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

// ============================================
// ================ BUFF MAIN =================
// ============================================

// create
export function createBuff(
  state: StateContext,
  buff: BuffDefinition,
  withEndTime?: number,
): StateContext {
  if (!buff.appliesTo) return state

  // global
  if (isBuffGlobal(state, buff)) {
    const existing = state.activeBuffsGlobal.get(buff.id)
    const newBuffInstance = handleBuffInstance(
      state,
      buff,
      existing,
      withEndTime,
    )

    return {
      ...state,
      activeBuffsGlobal: new Map(state.activeBuffsGlobal).set(
        buff.id,
        newBuffInstance,
      ),
    }
  }

  // personal
  const newPersonalBuffs = new Map(
    state.activeBuffs.get(state.action.characterId),
  )

  const existing = newPersonalBuffs.get(buff.id)
  const newBuffInstance = handleBuffInstance(state, buff, existing, withEndTime)

  return {
    ...state,
    activeBuffs: new Map(state.activeBuffs).set(
      state.action.characterId,
      newPersonalBuffs.set(buff.id, newBuffInstance),
    ),
  }
}

export function createBuffNext(
  state: StateContext,
  buff: BuffDefinition,
): StateContext {
  // remove buffNext entry
  const newBuffNext = new Set(state.buffNext)
  newBuffNext.delete(buff.id)

  if (isBuffGlobal(state, buff)) {
    const existing = state.activeBuffsGlobal.get(buff.id)
    const newBuffInstance = handleBuffInstance(state, buff, existing)

    return {
      ...state,
      activeBuffsGlobal: new Map(state.activeBuffsGlobal).set(
        buff.id,
        newBuffInstance,
      ),
      buffNext: newBuffNext,
    }
  }

  const newPersonalBuffs = new Map(
    state.activeBuffs.get(state.action.characterId),
  )
  const existing = newPersonalBuffs.get(buff.id)
  const newBuffInstance = handleBuffInstance(state, buff, existing)

  return {
    ...state,
    activeBuffs: new Map(state.activeBuffs).set(
      state.action.characterId,
      newPersonalBuffs.set(buff.id, newBuffInstance),
    ),
    buffNext: newBuffNext,
  }
}

export function createEnemyDebuff(
  state: StateContext,
  buff: BuffDefinition,
): StateContext {
  const existing = state.activeBuffsEnemy.get(buff.id)

  const newBuffInstance = handleBuffInstance(state, buff, existing)

  return {
    ...state,
    activeBuffsEnemy: new Map(state.activeBuffsEnemy).set(
      buff.id,
      newBuffInstance,
    ),
  }

  return state
}

// apply
function applyBuffStatChangesToCharacter(
  state: StateContext,
  character: Character,
  buff: BuffInstance,
): StateContext {
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

    // console.log(
    //   state.row,
    //   `newPersonalStatMap[${modifier.class}] += ${modifier.value}`,
    // )
  }

  // add to the correct buff column
  const newCharacters = new Map(state.characters).set(characterId, newCharacter)
  const newStatMap = new Map(state.statMap).set(characterId, newPersonalStatMap)

  if (isBuffGlobal(state, buff)) {
    return {
      ...state,
      characters: newCharacters,
      activeBuffsGlobal: new Map(state.activeBuffsGlobal).set(buff.id, newBuff),
      statMap: newStatMap,
    }
  }

  return {
    ...state,
    characters: newCharacters,
    activeBuffs: new Map(state.activeBuffs).set(
      characterId,
      new Map(state.activeBuffs.get(characterId)).set(buff.id, newBuff),
    ),
    statMap: newStatMap,
  }
}

export function applyBuffStatChanges(
  state: StateContext,
  buff: BuffInstance,
): StateContext {
  if (buff.usesLeft <= 0) return state

  if (isBuffGlobal(state, buff)) {
    let newState = state

    for (const character of state.characters.values()) {
      newState = applyBuffStatChangesToCharacter(newState, character, buff)
    }

    return newState
  }

  const character = state.characters.get(state.action.characterId)
  if (!character) return state

  return applyBuffStatChangesToCharacter(state, character, buff)
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
  if (isBuffGlobal(state, buff)) {
    let newState = state

    for (const character of state.characters.values()) {
      newState = removeBuffStatChangesFromCharacter(newState, character, buff)
    }

    return newState
  }

  const character = state.characters.get(state.action.characterId)
  if (!character) return state

  return removeBuffStatChangesFromCharacter(state, character, buff)
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

  const newPersonalBuffs = new Map(state.activeBuffs.get(characterId))

  const existing = newPersonalBuffs.get(buff.id)
  const currentStacks = existing?.stacks ?? 0

  // clamp to valid range
  const clampedStacks = Math.max(0, Math.min(targetStacks, buff.stackLimit))
  const stackDelta = clampedStacks - currentStacks

  const personalStatMap = state.statMap.get(characterId) ?? { ...baseStatMap }
  const newPersonalStatMap = { ...personalStatMap }

  for (const modifier of buff.modifiers) {
    newPersonalStatMap[modifier.class] += modifier.value * stackDelta
    // console.log(
    //   state.row,
    //   `newPersonalStatMap[${modifier.class}] += ${modifier.value * stackDelta}`,
    // )
  }

  const newBuff = {
    ...(existing ?? buff),
    stacks: clampedStacks,
    name: `${buff.id} x${clampedStacks}`,
    endTime: state.time + buff.duration,
  }

  // add to the correct buff column
  if (isBuffGlobal(state, buff)) {
    return {
      ...state,
      activeBuffsGlobal: new Map(state.activeBuffsGlobal).set(buff.id, newBuff),
      statMap: new Map(state.statMap).set(characterId, newPersonalStatMap),
    }
  }

  // personal
  return {
    ...state,
    activeBuffs: new Map(state.activeBuffs).set(
      characterId,
      newPersonalBuffs.set(buff.id, newBuff),
    ),
    statMap: new Map(state.statMap).set(characterId, newPersonalStatMap),
  }
}

export function applyStackingBuffStatChanges(
  state: StateContext,
  buff: BuffInstance,
  stacksToAdd: number = 1,
): StateContext {
  if (!buff.stackLimit) return state

  if (isBuffGlobal(state, buff)) {
    const existing = state.activeBuffsGlobal.get(buff.id)
    const currentStacks = existing?.stacks ?? 0

    let newState = state

    for (const character of state.characters.values()) {
      newState = setStackingBuffStacks(
        newState,
        character,
        buff,
        currentStacks + stacksToAdd,
      )
    }

    return newState
  }

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

export function removeStackingBuffStatChanges(
  state: StateContext,
  buff: BuffInstance,
  stacksToAdd: number = 1,
): StateContext {
  if (!buff.stackLimit) return state

  if (isBuffGlobal(state, buff)) {
    const existing = state.activeBuffsGlobal.get(buff.id)
    const currentStacks = existing?.stacks ?? 0

    let newState = state

    for (const character of state.characters.values()) {
      newState = setStackingBuffStacks(
        newState,
        character,
        buff,
        currentStacks + stacksToAdd,
      )
    }

    return newState
  }

  const character = state.characters.get(state.action.characterId)
  if (!character) return state

  const personalBuffs = state.activeBuffs.get(character.id)
  const existing = personalBuffs?.get(buff.id)
  const currentStacks = existing?.stacks ?? 0

  return setStackingBuffStacks(
    state,
    character,
    buff,
    currentStacks - stacksToAdd,
  )
}

// other
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

export function createDamageProcEvent(
  state: StateContext,
  buff: BuffInstance,
  consumeById: string[],
): StateContext {
  if (!buff.appliesTo) return state

  const { characterId } = state.action

  const newActiveBuffs = new Map(state.activeBuffs.get(characterId))

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

    const sourceId = buff.sourceEventId

    for (let i = 0; i < buffToBeConsumed.modifiers.length; i++) {
      const mod = buffToBeConsumed.modifiers[i]
      const procEvent = addNewTimelineEvent(state, buff, mod, i, sourceId)

      newQueuedEvents.push(procEvent)
    }
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

export function createCoordProcEvent(
  state: StateContext,
  buff: BuffDefinition,
  sourceEventId?: string | undefined,
): StateContext {
  if (!buff.appliesTo || !buff.modifiers) return state

  const newQueuedEvents: TimelineEvent[] = [...state.procQueue]

  for (let i = 0; i < buff.modifiers.length; i++) {
    const mod = buff.modifiers[i]
    const procEvent = addNewTimelineEvent(
      state,
      buff,
      mod,
      i,
      sourceEventId ?? state.action.id,
    )

    newQueuedEvents.push(procEvent)
  }

  const newState = applyCooldown(state, buff)

  return {
    ...newState,
    procQueue: newQueuedEvents,
  }
}

export function createHealProcEvent(
  state: StateContext,
  buff: BuffDefinition,
  sourceEventId?: string | undefined,
): StateContext {
  if (!buff.appliesTo || !buff.modifiers) return state
  const newQueuedEvents: TimelineEvent[] = [...state.procQueue]

  for (let i = 0; i < buff.modifiers.length; i++) {
    const mod = buff.modifiers[i]
    const procEvent = addNewTimelineEvent(
      state,
      buff,
      mod,
      i,
      sourceEventId ?? state.action.id,
    )

    newQueuedEvents.push(procEvent)
  }

  const newState = applyCooldown(state, buff)

  return {
    ...newState,
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
