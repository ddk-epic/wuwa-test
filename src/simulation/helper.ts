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
  DCOND_KEY,
  DEEPEN_KEY,
  ELEMENT,
  Skill,
  StateContext,
  StatMap,
  TimelineEvent,
} from "../shared/types"

// ============================================
// ================== UTILS ===================
// ============================================

export function getOriginId(action: TimelineEvent) {
  return `${action.skill.id}-${action.time}`
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
export function isOnField(state: StateContext, action: TimelineEvent) {
  return state.onFieldChar === action.characterId
}

export function hasSwapped(state: StateContext) {
  return state.onFieldChar !== state.prevChar
}

export function isBuffTarget(
  action: TimelineEvent,
  buff: BuffDefinition,
): boolean {
  const target = action.characterId

  return buff.appliesTo === target
}

export function isBuffGlobal(buff: BuffDefinition) {
  return buff.appliesTo === "all"
}

export function isAbility(
  action: TimelineEvent,
  buff: BuffDefinition,
): boolean {
  const trigger = action.skill.id

  return !!buff.trigger?.ability?.includes(trigger)
}

export function isCategory(
  action: TimelineEvent,
  buff: BuffDefinition,
): boolean {
  const trigger = action.skill.category

  return !!buff.trigger?.category?.includes(trigger)
}

export function hasCondition(
  state: StateContext,
  action: TimelineEvent,
  buff: BuffDefinition,
) {
  const condition = buff.trigger?.condition
  if (!condition) return false

  const buffs = state.activeBuffs.get(action.characterId)
  if (buffs && condition.some((c) => buffs.has(c))) return true

  const buffsGlobal = state.activeBuffsGlobal
  if (condition.some((c) => buffsGlobal.has(c))) return true
}

export function isOnCastEvent(action: TimelineEvent): boolean {
  return action.type === "cast"
}

export function isOnHitEvent(action: TimelineEvent): boolean {
  return action.type === "hit"
}

export function isOnCooldown(
  state: StateContext,
  buff: BuffDefinition,
): boolean {
  const cdEndTime = state.cooldowns.get(buff.id)

  if (cdEndTime) return cdEndTime > state.time

  return false
}

// ============================================
// =============== BUFF UTILS =================
// ============================================
export function applyResonanceFlat(
  state: StateContext,
  action: TimelineEvent,
  buff: BuffInstance,
): StateContext {
  if (!buff.modifiers) return state

  const characterId = action.characterId

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
  buff: BuffDefinition,
): StateContext {
  if (!buff.cooldown) return state

  const newCooldowns = new Map(state.cooldowns)
  newCooldowns.set(buff.id, state.time + buff.cooldown)

  console.log(
    state.row,
    `cooldowns(${buff.id} -> ${state.time + buff.cooldown})`,
  )

  return {
    ...state,
    cooldowns: newCooldowns,
  }
}

export function addToBuffNext(
  state: StateContext,
  buff: BuffDefinition,
): StateContext {
  if (buff.appliesTo !== "next") return state

  // console.log(state.row, `add buff ${buff.name} to buffNext`)

  return {
    ...state,
    buffNext: new Set<string>(state.buffNext).add(buff.id),
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

export function createBuff(
  state: StateContext,
  action: TimelineEvent,
  buff: BuffDefinition,
): StateContext {
  if (!buff.appliesTo) return state

  const characterId = action.characterId

  const activeBuffs =
    state.activeBuffs.get(characterId) ?? new Map<string, BuffInstance>()

  const existing = activeBuffs.get(buff.id)

  const buffInstance: BuffInstance = {
    ...buff,
    endTime: state.time + buff.duration, // refresh duration on re-trigger
    ...(buff.stackLimit && {
      stacks: Math.min(existing?.stacks ?? 0, buff.stackLimit),
    }),
    originId: existing?.originId ?? getOriginId(action),
  }

  // console.log(state.row, `add buff ${buff.name}`)

  const newPersonalBuffs = new Map(activeBuffs)
  newPersonalBuffs.set(buff.id, buffInstance)

  return {
    ...state,
    activeBuffs: new Map(state.activeBuffs).set(characterId, newPersonalBuffs),
  }
}

export function createBuffNext(
  state: StateContext,
  action: TimelineEvent,
  buff: BuffDefinition,
): StateContext {
  if (buff.appliesTo !== "next") return state

  const characterId = action.characterId

  const activeBuffs =
    state.activeBuffs.get(characterId) ?? new Map<string, BuffInstance>()

  const existing = activeBuffs.get(buff.id)

  const buffInstance: BuffInstance = {
    ...buff,
    endTime: state.time + buff.duration, // refresh duration on re-trigger
    ...(buff.stackLimit && {
      stacks: Math.min(existing?.stacks ?? 0, buff.stackLimit),
    }),
    originId: existing?.originId ?? getOriginId(action),
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

export function applyBuff(
  state: StateContext,
  action: TimelineEvent,
  buff: BuffInstance,
): StateContext {
  if (getOriginId(action) !== buff.originId) return state // only apply once on source action
  if (!buff.modifiers) return state

  const characterId = action.characterId

  const personalStatMap = state.statMap.get(characterId) ?? { ...baseStatMap }
  const newPersonalStatMap = { ...personalStatMap }

  for (const modifier of buff.modifiers) {
    newPersonalStatMap[modifier.class] += modifier.value

    // console.log(
    //   state.row,
    //   `${characterId} - `,
    //   `statMap[${modifier.class}]: `,
    //   newPersonalStatMap[modifier.class],
    //   `(${buff.name})`,
    // )
  }

  return {
    ...state,
    statMap: new Map(state.statMap).set(characterId, newPersonalStatMap),
  }
}

export function applyStackingBuff(
  state: StateContext,
  action: TimelineEvent,
  buff: BuffInstance,
  stacksToAdd: number = 1,
): StateContext {
  const characterId = action.characterId
  const personalBuffs = state.activeBuffs.get(characterId)
  const existing = personalBuffs?.get(buff.id)

  const currentStacks = existing?.stacks ?? 0
  return setStackingBuffStacks(state, action, buff, currentStacks + stacksToAdd)
}

export function createBuffGlobal(
  state: StateContext,
  action: TimelineEvent,
  buff: BuffDefinition,
): StateContext {
  const activeBuffsGlobal = state.activeBuffsGlobal

  const existing = activeBuffsGlobal.get(buff.id)

  const buffInstance: BuffInstance = {
    ...buff,
    endTime: state.time + buff.duration, // refresh duration on re-trigger
    ...(buff.stackLimit && {
      stacks: Math.min(existing?.stacks ?? 0, buff.stackLimit),
    }),
    originId: existing?.originId ?? getOriginId(action),
  }

  console.log(state.row, `add buff ${buff.name}`)

  return {
    ...state,
    activeBuffsGlobal: new Map(activeBuffsGlobal).set(buff.id, buffInstance),
  }
}

export function applyBuffGlobal(
  state: StateContext,
  action: TimelineEvent,
  buff: BuffInstance,
): StateContext {
  if (getOriginId(action) !== buff.originId) return state // only apply once on source action
  if (!buff.modifiers) return state

  const characters = state.characters
  const statMaps = new Map(state.statMap)

  for (const character of characters.values()) {
    const characterId = character.id

    const personalStatMap = state.statMap.get(characterId) ?? { ...baseStatMap }
    const newPersonalStatMap = { ...personalStatMap }

    for (const modifier of buff.modifiers) {
      newPersonalStatMap[modifier.class] += modifier.value

      console.log(
        state.row,
        `${characterId} - `,
        `statMap[${modifier.class}]: `,
        newPersonalStatMap[modifier.class],
        `(${buff.name})`,
      )
    }
    statMaps.set(characterId, newPersonalStatMap)
  }

  return {
    ...state,
    statMap: statMaps,
  }
}

export function setStackingBuffStacks(
  state: StateContext,
  action: TimelineEvent,
  buff: BuffInstance,
  targetStacks: number,
): StateContext {
  if (!buff.modifiers || !buff.stackLimit) return state

  const characterId = action.characterId

  const personalBuffs = state.activeBuffs.get(characterId)
  if (!personalBuffs) return state

  const existing = personalBuffs.get(buff.id)
  const currentStacks = existing?.stacks ?? 0

  const clampedStacks = Math.max(0, Math.min(targetStacks, buff.stackLimit))

  const stackDelta = clampedStacks - currentStacks
  if (stackDelta === 0) return state

  const personalStatMap = state.statMap.get(characterId) ?? { ...baseStatMap }
  const newPersonalStatMap = { ...personalStatMap }

  // Apply delta (positive = add, negative = remove)
  for (const modifier of buff.modifiers) {
    newPersonalStatMap[modifier.class] += modifier.value * stackDelta
  }

  const newPersonalBuffs = new Map(personalBuffs)

  if (clampedStacks > 0) {
    newPersonalBuffs.set(buff.id, {
      ...(existing ?? buff),
      stacks: clampedStacks,
      name: `${buff.id} x${clampedStacks}`,
      endTime: state.time + buff.duration,
    })
  } else {
    return state
  }

  return {
    ...state,
    activeBuffs: new Map(state.activeBuffs).set(characterId, newPersonalBuffs),
    statMap: new Map(state.statMap).set(characterId, newPersonalStatMap),
  }
}

export function removeBuffStatChanges(
  state: StateContext,
  action: TimelineEvent,
  buff: BuffInstance,
): StateContext {
  if (!buff.modifiers) return state

  const characterId = action.characterId

  const personalBuffs = state.activeBuffs.get(characterId)
  if (!personalBuffs) return state

  const existing = personalBuffs.get(buff.id)
  if (!existing) return state

  const personalStatMap = state.statMap.get(characterId) ?? { ...baseStatMap }
  const newPersonalStatMap = { ...personalStatMap }

  for (const modifier of buff.modifiers) {
    newPersonalStatMap[modifier.class] -= Math.max(modifier.value, 0)
  }

  return {
    ...state,
    statMap: new Map(state.statMap).set(characterId, newPersonalStatMap),
  }
}

export function removeStackingBuffStatChanges(
  state: StateContext,
  action: TimelineEvent,
  buff: BuffInstance,
  stacksToRemove: number = 1,
): StateContext {
  const characterId = action.characterId
  const personalBuffs = state.activeBuffs.get(characterId)
  const existing = personalBuffs?.get(buff.id)

  const currentStacks = existing?.stacks ?? 0
  return setStackingBuffStacks(
    state,
    action,
    buff,
    currentStacks - stacksToRemove,
  )
}

export function removeStackingBuff(
  state: StateContext,
  action: TimelineEvent,
  buff: BuffInstance,
  stacksToRemove: number = 1,
): StateContext {
  const characterId = action.characterId
  const personalBuffs = state.activeBuffs.get(characterId)
  if (!personalBuffs) return state

  const existing = personalBuffs.get(buff.id)
  if (!existing) return state

  const newStacks = (existing.stacks ?? 1) - stacksToRemove

  const personalStatMap = state.statMap.get(characterId) ?? { ...baseStatMap }
  const newPersonalStatMap = { ...personalStatMap }

  // Subtract modifiers based on number of stacks being removed
  for (const modifier of existing.modifiers ?? []) {
    newPersonalStatMap[modifier.class] -=
      modifier.value * Math.min(stacksToRemove, existing.stacks ?? 1)
  }

  const newPersonalBuffs = new Map(personalBuffs)
  if (newStacks > 0) {
    // Update buff with remaining stacks
    newPersonalBuffs.set(buff.id, { ...existing, stacks: newStacks })
  } else {
    // Remove buff entirely
    newPersonalBuffs.delete(buff.id)
  }

  return {
    ...state,
    activeBuffs: new Map(state.activeBuffs).set(characterId, newPersonalBuffs),
    statMap: new Map(state.statMap).set(characterId, newPersonalStatMap),
  }
}

export function resolveDamageProcs(
  state: StateContext,
  action: TimelineEvent,
  buff: BuffInstance,
  consumeById: string[],
): StateContext {
  if (!buff.appliesTo) return state

  const characterId = action.characterId

  const newActiveBuffs =
    state.activeBuffs.get(characterId) ?? new Map<string, BuffInstance>()

  const toConsume: BuffInstance[] = []

  for (const id of consumeById) {
    const found = newActiveBuffs.get(id)
    if (found) {
      toConsume.push(found)
    }
  }

  const newQueuedEvents: TimelineEvent[] = [...state.procQueue]

  for (const buffToBeConsumed of toConsume) {
    if (!buffToBeConsumed.modifiers) continue

    const mod = buffToBeConsumed.modifiers[0]
    const { skill, time } = action

    const damageProc: Skill = {
      id: buffToBeConsumed.id,
      name: `${buffToBeConsumed.id} Proc`,
      category: skill.category,
      classifications: buffToBeConsumed.classifications ?? [],
      mv: mod.value,
      frames: 0,
      hits: 1,
      forte: mod.forte ?? 0,
      forte2: mod.forte2 ?? 0,
      concerto: mod.concerto ?? 0,
      resonance: mod.resonance ?? 0,
    }

    const procEvent: TimelineEvent = {
      characterId,
      type: "hit",
      skill: damageProc,
      time,
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
