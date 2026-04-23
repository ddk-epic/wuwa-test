import type {
  BuffDefinition,
  BuffInstance,
  BuffResolver,
  CHECK_KEYS,
  CREATE_KEYS,
  MUTATE_KEYS,
  StateContext,
} from "@/shared/types"

import encoreResolver from "../content/characters/encore/resolver"
import sanhuaResolver from "../content/characters/sanhua/resolver"
import shorekeeperResolver from "@/content/characters/shorekeeper/resolver"
import verinaResolver from "../content/characters/verina/resolver"

import weaponResolver from "@/content/weapons/resolver"
import echoResolver from "@/content/echoes/resolver"
import echoSetResolver from "@/content/echoes/set-resolver"
import {
  addDependencyStacksToBuff,
  addStacksToBuff,
  addToBuffDeferred,
  addToBuffNext,
  applyBuffStatChanges,
  applyDCondFlat,
  applyStackingBuffStatChanges,
  createBuff,
  createBuffNext,
  createCoordProcEvent,
  createDamageProcEvent,
  createHealProcEvent,
  hasConditionById,
  hasConditionByName,
  hasSwapped,
  isAbility,
  isBuffGlobal,
  isBuffSource,
  isBuffTarget,
  isCategory,
  isCoordEvent,
  isHealEvent,
  isIndex,
  isOnCooldown,
  isOnField,
  isDamageEvent,
  not,
  removeBuffStatChanges,
  removeCondition,
  removeStackingBuffStatChanges,
} from "./helper"

export const buffHandler: Record<string, BuffResolver> = {
  /* characters */
  ...encoreResolver,
  ...sanhuaResolver,
  ...shorekeeperResolver,
  ...verinaResolver,
  /* weapons */
  ...weaponResolver,
  /* echo */
  ...echoResolver,
  /* echo sets */
  ...echoSetResolver,
}

export default buffHandler

export const buffCheckKeys = [
  // state
  "isOnField",
  "isOffField",
  "hasSwapped",
  "isNotOnCooldown",
  // event
  "isDamageEvent",
  "isHealEvent",
  "isCoordEvent",
  // target
  "isBuffSource",
  "isBuffTarget",
  "isBuffGlobal",
  // buff
  "isAbility",
  "isCategory",
  "isIndex",
  "hasConditionById",
  "hasConditionByName",
] as const

export const buffCheckRegistry: Record<
  CHECK_KEYS,
  (state: StateContext, buff: BuffDefinition, triggerIndex: number) => boolean
> = {
  // state
  isOnField: isOnField,
  isOffField: not(isOnField),
  hasSwapped: hasSwapped,
  isNotOnCooldown: not(isOnCooldown),
  // event
  isDamageEvent: isDamageEvent,
  isHealEvent: isHealEvent,
  isCoordEvent: isCoordEvent,
  // target
  isBuffSource: isBuffSource,
  isBuffTarget: isBuffTarget,
  isBuffGlobal: isBuffGlobal,
  // buff
  isAbility: isAbility,
  isCategory: isCategory,
  isIndex: isIndex,
  hasConditionById: hasConditionById,
  hasConditionByName: hasConditionByName,
}

export const buffCreationKeys = [
  // create
  "createBuff",
  "createBuffNext",
  // remove
  "removeCondition",
  // move
  "addToBuffDeferred",
  "addToBuffNext",
  // create event
  "createDamageProcEvent",
  "createCoordProcEvent",
  "createHealProcEvent",
] as const

export const buffCreationRegistry: Record<
  CREATE_KEYS,
  (state: StateContext, buff: BuffDefinition) => StateContext
> = {
  // create
  createBuff: createBuff,
  createBuffNext: createBuffNext,
  // remove
  removeCondition: removeCondition,
  // move
  addToBuffDeferred: addToBuffDeferred,
  addToBuffNext: addToBuffNext,
  // create event
  createDamageProcEvent: createDamageProcEvent,
  createCoordProcEvent: createCoordProcEvent,
  createHealProcEvent: createHealProcEvent,
}

export const buffMutationKeys = [
  //utils
  "addStacksToBuff",
  "addDependencyStacksToBuff",
  // apply
  "applyBuffStatChanges",
  "applyStackingBuffStatChanges",
  "applyDCondFlat",
  // remove
  "removeBuffStatChanges",
  "removeStackingBuffStatChanges",
  // create event
  "createDamageProcEvent",
] as const

export const buffMutationRegistry: Record<
  MUTATE_KEYS,
  (state: StateContext, buff: BuffInstance) => StateContext
> = {
  //utils
  addStacksToBuff: addStacksToBuff,
  addDependencyStacksToBuff: addDependencyStacksToBuff,
  // apply
  applyBuffStatChanges: applyBuffStatChanges,
  applyStackingBuffStatChanges: applyStackingBuffStatChanges,
  applyDCondFlat: applyDCondFlat,
  // remove
  removeBuffStatChanges: removeBuffStatChanges,
  removeStackingBuffStatChanges: removeStackingBuffStatChanges,
  // create event
  createDamageProcEvent: createDamageProcEvent,
}
