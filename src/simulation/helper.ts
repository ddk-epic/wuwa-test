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
  ModifierData,
  CHECK_KEYS,
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
import { buffCheckRegistry } from "./resolver"

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
  triggerRules: CHECK_KEYS[],
): boolean {
  if (!buff.triggers?.length || !triggerRules?.length) return true // if no triggers/rules, allow
  // console.log(
  //   state.row,
  //   buff.name,
  //   triggerRules,
  //   buff.triggers.map((_, i) =>
  //     triggerRules.map((key) => buffCheckRegistry[key](state, buff, i)),
  //   ),
  //   buff.triggers.map((_, i) =>
  //     triggerRules.every((key) => buffCheckRegistry[key](state, buff, i)),
  //   ),
  // )

  for (let i = 0; i < buff.triggers.length; i++) {
    const passed = triggerRules.every((key) => {
      const fn = buffCheckRegistry[key]

      return fn(state, buff, i)
    })
    if (passed) {
      // console.log(state.row, buff.name, passed)
      return true
    }
  }
  return false
}

export function shouldEvaluate(
  state: StateContext,
  buff: BuffDefinition,
  evaluateRules: CHECK_KEYS[],
): boolean {
  if (!buff.onEvent?.conditions?.length || !evaluateRules?.length) return true // if no triggers/rules, allow

  const passed = buff.onEvent?.conditions?.some((ref) => {
    const fn = buffCheckRegistry[ref]
    if (!fn) {
      console.log(`Missing buffCheckRegistry for ${ref}`)
      return false
    }
    return fn(state, buff, 0)
  })
  if (passed) {
    // console.log(state.row, buff.name, passed)
    return true
  }

  return false
}

export function assignBuffsToBuffArrays(
  state: StateContext,
  newBuffs: BuffInstance[],
): StateContext {
  let newState = { ...state }

  for (const buff of newBuffs) {
    if (!buff.target?.appliesTo) continue

    switch (buff.target.appliesTo) {
      case "all":
        const newGlobalBuffs = new Map(newState.activeBuffsGlobal)
        newGlobalBuffs.set(buff.id, buff)
        newState = { ...newState, activeBuffsGlobal: newGlobalBuffs }
        continue

      case "enemy":
        const newEnemyBuffs = new Map(newState.activeBuffsEnemy)
        newEnemyBuffs.set(buff.id, buff)
        newState = { ...newState, activeBuffsEnemy: newEnemyBuffs }
        continue
    }

    // personal buffs
    const personalBuffs = newState.activeBuffs.get(buff.target.appliesTo)
    if (!personalBuffs) {
      console.log(`buff array for ${buff.target.appliesTo} does not exist.`)
      continue
    }

    newState = {
      ...newState,
      activeBuffs: new Map(newState.activeBuffs).set(
        buff.target.appliesTo,
        new Map(personalBuffs).set(buff.id, buff),
      ),
    }
  }

  return newState
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

export function isDamageEvent(state: StateContext): boolean {
  return state.action.type !== "heal" && state.action.index > 0
}

export function isHealEvent(state: StateContext): boolean {
  return state.action.type === "heal"
}

export function isCoordEvent(state: StateContext): boolean {
  return state.action.type === "coord"
}

// buff getters
export function getBuffById(
  state: StateContext,
  buffId: string,
): BuffInstance | undefined {
  for (const [characterId] of state.characters) {
    const existing = state.activeBuffs.get(characterId)?.get(buffId)
    if (existing) return existing
  }

  const existing = state.activeBuffsGlobal.get(buffId)
  if (existing) return existing

  const existing2 = state.activeBuffsEnemy.get(buffId)
  if (existing2) return existing2

  return
}

export function isAbilityOrCategory(
  state: StateContext,
  buff: BuffDefinition,
  target: string,
): boolean {
  if (!buff.triggers || buff.triggers?.length) return false

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
  return state.action.characterId === buff.target?.source
}

export function isBuffTarget(
  state: StateContext,
  buff: BuffDefinition,
): boolean {
  return state.action.characterId === buff.target?.appliesTo
}

export function isBuffGlobal(
  _state: StateContext,
  buff: BuffDefinition,
): boolean {
  return buff.target?.appliesTo === "all"
}

export function isIndex(
  state: StateContext,
  buff: BuffDefinition,
  triggerIndex: number,
): boolean {
  return buff.triggers?.[triggerIndex]?.index === state.action.index
}

export function isAbility(
  state: StateContext,
  buff: BuffDefinition,
  triggerIndex: number,
): boolean {
  return buff.triggers?.[triggerIndex]?.ability === state.action.skill.id
}

export function isCategory(
  state: StateContext,
  buff: BuffDefinition,
  triggerIndex: number,
): boolean {
  return buff.triggers?.[triggerIndex]?.category === state.action.skill.category
}

export function hasConditionById(
  state: StateContext,
  buff: BuffDefinition,
  triggerIndex: number,
): boolean {
  const condition = buff.triggers?.[triggerIndex]?.condition ?? ""

  const enemyBuffs = state.activeBuffsEnemy
  if (enemyBuffs.has(condition)) return true

  const buffs = state.activeBuffs.get(state.action.characterId)
  if (buffs && buffs.has(condition)) return true

  const globalBuffs = state.activeBuffsGlobal
  if (globalBuffs.has(condition)) return true

  return false
}

export function hasConditionByName(
  state: StateContext,
  buff: BuffDefinition,
  triggerIndex: number,
): boolean {
  const condition = buff.triggers?.[triggerIndex]?.condition ?? ""

  const enemyBuffs = state.activeBuffsEnemy
  if ([...enemyBuffs].some(([_, b]) => b.name === condition)) return true

  const buffs = state.activeBuffs.get(state.action.characterId)
  if (buffs && [...buffs].some(([_, b]) => b.name === condition)) return true

  const globalBuffs = state.activeBuffsGlobal
  if ([...globalBuffs].some(([_, b]) => b.name === condition)) return true

  return false
}

// ============================================
// =============== BUFF UTILS =================
// ============================================

export function getStacksFromBuff(
  state: StateContext,
  buff: BuffInstance,
): number {
  if (!buff.dep) return 0

  const { characterId } = state.action

  const buffId = Object.keys(buff.dep)[0]
  const existing = state.activeBuffs.get(characterId)?.get(buffId)

  return existing?.stacks ?? 0
}

export function getStacksFromStatReq(
  state: StateContext,
  buff: BuffDefinition | BuffInstance,
): number {
  const characterId = buff.target?.source
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
): BuffInstance {
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
  mod: ModifierData,
  index: number,
  sourceEventId: string,
): TimelineEvent {
  const type = mod.type ?? "damage"

  const newEvent: TimelineEvent = {
    id: String(state.row) + type,
    characterId: buff.target?.source ?? "encore",
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
    buff.triggers?.flatMap((t) =>
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

export function addStacksToBuff(
  state: StateContext,
  buff: BuffInstance,
): StateContext {
  if (!buff.dep) return state
  if (buff.usesLeft <= 0) return state

  const { characterId } = state.action
  const newPersonalBuffs = new Map(state.activeBuffs.get(characterId))

  let existing: BuffInstance | undefined
  let stacksToAdd = 0

  for (const [id, bit] of Object.entries(buff.dep)) {
    // if stackToAdd
    stacksToAdd = state.action.skill.category === id ? bit : 0
    // if buff id
    existing = newPersonalBuffs.get(id)
  }

  const currStacks = buff.stacks ?? 0

  // stackToAdd
  if (stacksToAdd) {
    const newBuffWithStacksToAdd = {
      ...buff,
      stacks: Math.max(currStacks + stacksToAdd - 1, currStacks), // -1 because the default adds 1
      usesLeft: Math.max(buff.usesLeft - 1, 0),
    }

    if (isBuffGlobal(state, buff)) {
      return {
        ...state,
        activeBuffsGlobal: new Map(state.activeBuffsGlobal).set(
          buff.id,
          newBuffWithStacksToAdd,
        ),
      }
    }

    return {
      ...state,
      activeBuffs: new Map(state.activeBuffs).set(
        characterId,
        newPersonalBuffs.set(buff.id, newBuffWithStacksToAdd),
      ),
    }
  }

  // buff id
  const newBuffInstance = {
    ...buff,
    stacks: Math.max((existing?.stacks ?? 0) - 1, currStacks), // -1 because the default adds 1
    usesLeft: Math.max(buff.usesLeft - 1, 0),
  }

  if (isBuffGlobal(state, buff)) {
    return {
      ...state,
      activeBuffsGlobal: new Map(state.activeBuffsGlobal).set(
        buff.id,
        newBuffInstance,
      ),
    }
  }

  return {
    ...state,
    activeBuffs: new Map(state.activeBuffs).set(
      characterId,
      newPersonalBuffs.set(buff.id, newBuffInstance),
    ),
  }
}

export function addDependencyStacksToBuff(
  state: StateContext,
  buff: BuffInstance,
): StateContext {
  if (!buff.dep) return state

  const { characterId } = state.action
  const newPersonalBuffs = new Map(state.activeBuffs.get(characterId))

  let stacks = 0
  const STACK_BIT = 1 // 0001

  for (const [id, bit] of Object.entries(buff.dep)) {
    if (!(bit & STACK_BIT)) continue
    const foundBuff = newPersonalBuffs.get(id)
    if (foundBuff) stacks++
  }

  const newBuff = {
    ...buff,
    stacks,
  }

  return {
    ...state,
    activeBuffs: new Map(state.activeBuffs).set(
      characterId,
      newPersonalBuffs.set(buff.id, newBuff),
    ),
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
  if (!buff.target?.appliesTo) return state

  switch (buff.target.appliesTo) {
    case "all": {
      const existing = state.activeBuffsGlobal.get(buff.id)
      const newBuffInstance = handleBuffInstance(state, buff, existing)

      return {
        ...state,
        activeBuffsGlobal: new Map(state.activeBuffsGlobal).set(
          buff.id,
          newBuffInstance,
        ),
      }
    }

    case "enemy": {
      const existing = state.activeBuffsEnemy.get(buff.id)
      const newBuffInstance = handleBuffInstance(state, buff, existing)

      return {
        ...state,
        activeBuffsEnemy: new Map(state.activeBuffsEnemy).set(
          buff.id,
          newBuffInstance,
        ),
      }
    }

    default: {
      const newPersonalBuffs = new Map(
        state.activeBuffs.get(buff.target.appliesTo),
      )
      const existing = newPersonalBuffs.get(buff.id)
      const newBuffInstance = handleBuffInstance(state, buff, existing)

      return {
        ...state,
        activeBuffs: new Map(state.activeBuffs).set(
          buff.target.appliesTo,
          newPersonalBuffs.set(buff.id, newBuffInstance),
        ),
      }
    }
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
  const currentStacks = Math.max(
    0,
    Math.min(existing?.stacks ?? 0, buff.stackLimit),
  )

  // clamp to valid range
  const clampedStacks = Math.max(0, Math.min(targetStacks, buff.stackLimit))
  const stackDelta = clampedStacks - currentStacks
  console.table({
    [state.row]: buff.name,
    tgtStacks: targetStacks,
    [clampedStacks + "-" + currentStacks]: stackDelta,
  })

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
  buff: BuffDefinition | BuffInstance,
): StateContext {
  if (!buff.dep || !buff.target?.appliesTo) return state

  const sourceId = buff.sourceEventId
    ? buff.sourceEventId
    : state.action.sourceEventId
  if (!sourceId) return state

  const { characterId } = state.action

  const newActiveBuffs = new Map(state.activeBuffs.get(characterId))

  const toConsume: BuffInstance[] = []
  const CONSUME_BIT = 2 // 0010

  for (const [id, bit] of Object.entries(buff.dep)) {
    if (!(bit & CONSUME_BIT)) continue
    const foundBuff = newActiveBuffs.get(id)
    if (foundBuff) {
      toConsume.push(foundBuff)
    }
  }

  const newQueuedEvents: TimelineEvent[] = [...state.procQueue]

  for (const buffToBeConsumed of toConsume) {
    if (!buffToBeConsumed.modifiers) continue

    for (let i = 0; i < buffToBeConsumed.modifiers.length; i++) {
      const mod = buffToBeConsumed.modifiers[i]
      const procEvent = addNewTimelineEvent(state, buff, mod, i + 1, sourceId) // i = 1 for hit event

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
): StateContext {
  if (!buff.target?.appliesTo || !buff.modifiers) return state

  let sourceId = buff.sourceEventId
    ? buff.sourceEventId
    : state.action.sourceEventId
  if (buff.dep) {
    const buffId = Object.keys(buff.dep)[0]
    sourceId = getBuffById(state, buffId)?.sourceEventId
  }
  if (!sourceId) return state

  const newQueuedEvents: TimelineEvent[] = [...state.procQueue]

  for (let i = 0; i < buff.modifiers.length; i++) {
    const mod = buff.modifiers[i]
    const procEvent = addNewTimelineEvent(state, buff, mod, i, sourceId)

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
): StateContext {
  if (!buff.target?.appliesTo || !buff.modifiers) return state
  const sourceId = buff.sourceEventId
    ? buff.sourceEventId
    : state.action.sourceEventId
  if (!sourceId) return state

  const newQueuedEvents: TimelineEvent[] = [...state.procQueue]

  for (let i = 0; i < buff.modifiers.length; i++) {
    const mod = buff.modifiers[i]
    const procEvent = addNewTimelineEvent(state, buff, mod, i, sourceId)

    newQueuedEvents.push(procEvent)
  }

  const newState = applyCooldown(state, buff)

  return {
    ...newState,
    procQueue: newQueuedEvents,
  }
}

// special TODO: update to fit architecture
export function createVerinaCoord(
  state: StateContext,
  buff: BuffInstance,
): StateContext {
  const buffId = "Photosynthesis Mark"
  const parentId = getBuffById(state, buffId)?.sourceEventId
  return createCoordProcEvent(state, buff, parentId)
}

export function copyStacksAndApply(
  state: StateContext,
  buff: BuffInstance,
): StateContext {
  const stacksToAdd = getStacksFromBuff(state, buff)
  if (!stacksToAdd) return state

  return applyStackingBuffStatChanges(state, buff, stacksToAdd)
}

export function createOuterStellarRealm(
  state: StateContext,
  buff: BuffInstance,
): StateContext {
  let newState = createHealProcEvent(state, buff)
  return createBuff(newState, buff)
}

export function createInnerStellarRealm(
  state: StateContext,
  buff: BuffInstance,
): StateContext {
  // copy buff duration
  const depBuffId = "Outer Stellarealm"
  const depBuff = getBuffById(state, depBuffId)
  if (!depBuff) return state

  let newState = createBuff(state, buff, depBuff.endTime)

  // update buff on init
  const newBuff = getBuffById(newState, buff.id)
  const stacksToAdd = getStacksFromStatReq(newState, buff)
  if (!newBuff || !stacksToAdd) return newState

  return applyStackingBuffStatChanges(newState, newBuff, stacksToAdd)
}

export function updateInnerStellarRealm(
  state: StateContext,
  buff: BuffInstance,
): StateContext {
  const stacksToAdd = getStacksFromStatReq(state, buff)
  if (!stacksToAdd) return state

  return applyStackingBuffStatChanges(state, buff, stacksToAdd)
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
