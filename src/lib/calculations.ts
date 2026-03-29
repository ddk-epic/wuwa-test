import {
  ELEMENT_KEYS,
  type BuffInstance,
  type BUFF_TYPE,
  type BuffMap,
  type Character,
  type Context,
  type Result,
  type Skill,
  type TimelineEntry,
  type BuffDefinition,
} from "@/constants/types"

import {
  buffHandler,
  canTriggerBuff,
  getBonus,
  getDefMultiplier,
  getResMultiplier,
  isOffFieldBuff,
  hasSwapped,
  isMatchingActionType,
  isDCondKey,
  findSkillMatch,
  isOnField,
  getDeepen,
  findBuffMatch,
} from "./helper"

import {
  BONUSSTAT_KEYS,
  type BONUSSTAT_KEY,
  type CHARACTER_KEY,
} from "@/constants/characters"
import { buffs } from "./effects/buffs"
import { echoBuffs } from "./effects/echo-buffs"
import { setBuffs } from "./effects/set-buffs"
import { weaponBuffs } from "./effects/weapon-buffs"
import { bonusToDeepen, getSkillLevel, totalBuffMap } from "@/constants/maps"

function removeExpiredBuffs(ctx: Context, action: TimelineEntry) {
  const characterId = action.characterId
  const currentTime = ctx.time
  const buffsToRemove = new Set<string>()

  function shouldRemove(buff: BuffInstance): boolean {
    // expired
    if (buff.endTime <= currentTime) return true

    // off-field buff while character is on-field
    if (isOffFieldBuff(buff) && isOnField(characterId, ctx.onFieldChar)) {
      return true
    }

    // other filter rules

    return false
  }

  // evaluate personal buffs
  const buffs =
    ctx.activeBuffs.get(characterId) ?? new Map<string, BuffInstance>()
  for (const buff of buffs.values()) {
    if (shouldRemove(buff)) {
      buffsToRemove.add(buff.id)
    }
  }

  // evaluate team buffs
  const buffsTeam = ctx.activeBuffsTeam ?? new Map<string, BuffInstance>()
  for (const buff of buffsTeam.values()) {
    if (shouldRemove(buff)) {
      buffsToRemove.add(buff.id)
    }
  }

  // remove buffs
  for (const buffId of buffsToRemove) {
    buffs.delete(buffId)
    buffsTeam.delete(buffId)
  }

  ctx.activeBuffs.set(characterId, buffs)
  ctx.activeBuffsTeam = buffsTeam
}

function addOnSwapBuffs(ctx: Context, action: TimelineEntry) {
  const characterId = action.characterId
  const currentTime = ctx.time
  const buffNext = ctx.buffNext
  const buffs =
    ctx.activeBuffs.get(characterId) ?? new Map<string, BuffInstance>()
  const buffsTeam = ctx.activeBuffsTeam ?? new Map<string, BuffInstance>()

  if (!hasSwapped(ctx.prevChar, characterId) || buffNext.size === 0) return

  for (const buff of buffNext.values()) {
    const isAlreadyActive = buffs.has(buff.id) || buffsTeam.has(buff.id)
    if (isAlreadyActive) continue

    // add end time
    const buffInstance: BuffInstance = {
      ...buff,
      endTime: currentTime + buff.duration,
    }

    const isGlobal = buff.appliesTo === "all"
    const buffArray = isGlobal ? buffsTeam : buffs
    buffArray.set(buff.id, buffInstance)
    // console.log(
    //   `add ${BuffInstance.name} to ${isGlobal ? "buffsTeam" : "buffs"}`,
    // )
  }
  ctx.activeBuffs.set(characterId, buffs)
  ctx.activeBuffsTeam = buffsTeam
}

function isBuffEligible(
  ctx: Context,
  action: TimelineEntry,
  buffs: Map<string, BuffInstance>,
  buffsTeam: Map<string, BuffInstance>,
  buff: BuffDefinition,
): boolean {
  const characterId = action.characterId
  const charData = ctx.characters.get(characterId)

  if (buff.source !== characterId) return false

  const skillMatch = findSkillMatch(ctx, action, buff) // check name/category/mode
  if (!skillMatch) return false
  const buffMatch = findBuffMatch(ctx, action, buff) // check if condition is an active buffs
  if (buff.triggeredBy?.condition && !buffMatch) return false

  if (!canTriggerBuff(ctx, buff.id)) return false
  if (!isMatchingActionType(buff, action)) return false

  const isAlreadyActive = buffs.has(buff.id) || buffsTeam.has(buff.id)
  if (isAlreadyActive) return false

  const sequenceRequirement = buff.sequenceReq ?? 0
  if (charData && sequenceRequirement > charData.sequence) return false

  const offFieldCheck =
    isOffFieldBuff(buff) && isOnField(characterId, ctx.onFieldChar) // off-field buff check
  if (offFieldCheck) return false

  return true
}

function addTriggeredBuffs(
  ctx: Context,
  action: TimelineEntry,
  allBuffs: BuffDefinition[],
) {
  const characterId = action.characterId
  const currentTime = ctx.time
  const buffs =
    ctx.activeBuffs.get(characterId) ?? new Map<string, BuffInstance>()
  const buffsTeam = ctx.activeBuffsTeam

  for (const buff of allBuffs) {
    //  preliminary checks
    if (!isBuffEligible(ctx, action, buffs, buffsTeam, buff)) continue
    const isGlobal = buff.appliesTo === "all"

    // handle end time (convert to BuffInstance)
    const endTime = currentTime + buff.duration
    const buffInstance = buff.stackLimit
      ? { ...buff, stackCount: 0, endTime }
      : { ...buff, endTime }

    switch (buff.type) {
      case "BuffNext":
        // handle outro
        ctx.buffNext.set(buff.id, buffInstance)
        // console.log(`add ${BuffInstance.name} to buffNext`)
        continue

      case "Mode":
        // handle mode
        const key = isGlobal ? "all" : characterId
        const modeArray = ctx.mode.get(key) ?? new Map<string, BuffInstance>()
        if (modeArray) {
          modeArray.set(buff.id, buffInstance)
        }
        // console.log(
        //   ctx.row,
        //   `add ${BuffInstance.name} to ${isGlobal ? "modeTeam" : "mode"}`,
        // )
        break

      case "Damage":
        // handle damage proc
        ctx.buffDeferred.set(buff.id, buffInstance)
        // console.log(ctx.row, `add ${BuffInstance.name} to buffDeferred`)
        break

      default:
      // console.log(`default ${BuffInstance.name}`)
    }
    // switch end

    const buffArray = isGlobal ? buffsTeam : buffs
    buffArray.set(buff.id, buffInstance)
    // console.log(
    //   ctx.row,
    //   `add ${BuffInstance.name} to ${isGlobal ? "buffsTeam" : "buffs"}`,
    // )

    if (buff.cooldown) {
      ctx.cooldowns[buff.id] = ctx.time + buff.cooldown
      // console.log(ctx.row, `cooldowns[${buff.id}]:`, ctx.cooldowns[buff.id])
    }
  }
  ctx.activeBuffs.set(characterId, buffs)
  ctx.activeBuffsTeam = buffsTeam
}

function handleEnergyShare(ctx: Context, action: TimelineEntry) {
  const value = action.skill.resonance
  for (const [characterId, character] of ctx.characters) {
    const activeMultiplier = characterId === action.characterId ? 1 : 0.5

    character.dCond.resonance += value * activeMultiplier
  }
}

function evaluateDCond(ctx: Context, action: TimelineEntry) {
  const characterId = action.characterId
  const character = ctx.characters.get(characterId)
  const skill = action.skill

  if (!character) return

  // handle resonance energy
  if (action.type === "cast" && skill.category === "liberation") {
    character.dCond.resonance = 0
  }
  handleEnergyShare(ctx, action)

  // handle concerto
  character.dCond.concerto += skill.concerto
}

function calculateDamage(ctx: Context, action: TimelineEntry) {
  if (action.type === "cast") return 0

  const characterId = action.characterId
  const skill = action.skill
  const char = ctx.characters.get(characterId)
  const buffMap = ctx.buffMap.get(characterId)

  if (!char || !buffMap) return 0

  // character
  const characterLevel = 90
  const skillLevel = 10
  const attack = char.atk * (1 + buffMap.atk) + char.bonusStats.atkFlat
  const skillMultiplier =
    action.skill.mv * getSkillLevel[skillLevel] * (1 + buffMap.multiplier)
  const bonusMultiplier =
    1 + getBonus(buffMap, skill.classifications) + buffMap.bonus
  const deepenMultiplier = 1 + getDeepen(buffMap, skill.classifications)
  const crit = Math.min(buffMap.crit, 1)
  const critDmg = buffMap.critDmg
  const critMultiplier = 1 + crit * (critDmg - 1)

  // enemy
  const enemyLevel = 100
  const enemyResistance = 0.2
  const enemyDefense = 792 + 8 * enemyLevel
  const resDown = buffMap.resIgnore
  const defDown = buffMap.defIgnore
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

function evaluateBuffs(ctx: Context, action: TimelineEntry) {
  const { characterId, skill, time } = action
  const character = ctx.characters.get(characterId)
  const buffs =
    ctx.activeBuffs.get(characterId) ?? new Map<string, BuffInstance>()

  for (const buff of buffs.values()) {
    // preliminary checks
    if (buff.appliesTo === "all") {
      console.log(ctx.row, `buff ${buff.name} does not belong in buffs`)
      continue
    }

    const offFieldCheck =
      isOffFieldBuff(buff) && isOnField(characterId, ctx.onFieldChar)
    if (offFieldCheck) continue

    // handle stacking buff
    let currentModifiers = buff.modifiers

    if (buff.stackLimit && action.type === "hit") {
      const skillMatch = findSkillMatch(ctx, action, buff) // check name/category/mode
      if (!skillMatch) break

      const newModifiers = buffHandler.stacking(buff, time)
      if (!newModifiers) break

      buff.modifiers = newModifiers
      currentModifiers = newModifiers
    }

    switch (buff.type) {
      case "DCondFlat":
        // add flat DCond mod to stat
        for (const modifier of buff.modifiers) {
          if (character && isDCondKey(modifier.class)) {
            character.dCond[modifier.class] += modifier.value
          }
          // console.log(
          //   ctx.row,
          //   `${characterId} ${buff.name} dCond[${modifier.class}]:`,
          //   modifier.value,
          // )
        }
        break

      case "BuffConsume":
        const ProcsToRemove = new Set<string>()

        for (const buff of ctx.buffDeferred.values()) {
          const mod = buff.modifiers[0]

          const damageProc: Skill = {
            id: buff.id,
            name: `${buff.id} Proc`,
            category: skill.category,
            classifications: buff.classifications ?? [],
            mv: buff.modifiers[0].value,
            frames: 0,
            hits: 1,
            forte: mod.forte ?? 0,
            forte2: mod.forte2 ?? 0,
            concerto: mod.concerto ?? 0,
            resonance: mod.resonance ?? 0,
          }
          const procEvent: TimelineEntry = {
            characterId: characterId,
            type: "hit",
            skill: damageProc,
            time,
          }
          ctx.proc.damage = calculateDamage(ctx, procEvent)
          evaluateDCond(ctx, procEvent)
          ProcsToRemove.add(buff.id)
          // console.log(
          //   `${damageProcc.name} successfully procced for`,
          //   ctx.proc.damage,
          // )
        }
        // clean up
        for (const id of ProcsToRemove) {
          buffs.delete(id)
          ctx.buffDeferred.delete(id)
        }
        break

      default:
      // console.log(ctx.row, `evaluateBuffs: default (${buff.name})`)
    }
    // switch end
    if (!buff.type.includes("Buff")) continue

    // apply modifiers
    for (const modifier of currentModifiers) {
      const value = modifier.stackValue ? modifier.stackValue : modifier.value

      // default dCond check
      if (character && modifier.concerto) {
        character.dCond.concerto += modifier.concerto
      }
      if (character && modifier.resonance) {
        character.dCond.resonance += modifier.resonance
      }

      const buffMap = ctx.buffMap.get(characterId)
      if (buffMap) {
        if (modifier.class === "allEle") {
          for (const element of ELEMENT_KEYS) {
            buffMap[element] += value
          }
          continue
        }

        if (modifier.class === "allDeep") {
          for (const element of ELEMENT_KEYS) {
            const deepenElement = bonusToDeepen[element]
            buffMap[deepenElement] += value
          }
          continue
        }

        buffMap[modifier.class] += value
        // console.log(
        //   ctx.row,
        //   buff.name, `buffMap[${characterId}][${modifier.class}]:`, buffMap[modifier.class]
        // )
      }
    }
  }
}

function evaluateBuffsGlobal(ctx: Context, action: TimelineEntry) {
  const time = action.time
  const characters = ctx.characters
  const buffsTeam = ctx.activeBuffsTeam

  for (const buff of buffsTeam.values()) {
    for (const [characterId, character] of characters) {
      // preliminary checks
      const offFieldCheck =
        isOffFieldBuff(buff) && isOnField(characterId, ctx.onFieldChar)
      if (offFieldCheck) continue

      // handle stacking buff
      let currentModifiers = buff.modifiers

      if (buff.stackLimit && action.type === "hit") {
        const skillMatch = findSkillMatch(ctx, action, buff) // check name/category/mode
        if (!skillMatch) break

        const newModifiers = buffHandler.stacking(buff, time)
        if (!newModifiers) break

        buff.modifiers = newModifiers
        currentModifiers = newModifiers
      }

      if (!buff.type.includes("Buff")) continue

      // apply modifiers
      for (const modifier of currentModifiers) {
        const value = modifier.stackValue ? modifier.stackValue : modifier.value

        // default dCond check
        if (character && modifier.concerto) {
          character.dCond.concerto += modifier.concerto
        }
        if (character && modifier.resonance) {
          character.dCond.resonance += modifier.resonance
        }

        const buffMap = ctx.buffMap.get(characterId)
        if (buffMap) {
          if (modifier.class === "allEle") {
            for (const element of ELEMENT_KEYS) {
              buffMap[element] += value
            }
            continue
          }

          if (modifier.class === "allDeep") {
            for (const element of ELEMENT_KEYS) {
              const deepenElement = bonusToDeepen[element]
              buffMap[deepenElement] += value
            }
            continue
          }

          buffMap[modifier.class] += value
          // console.log(
          //   ctx.row,
          //   buff.name, `buffMap[${characterId}][${modifier.class}]:`, buffMap[modifier.class]
          // )
        }
      }
    }
  }
}

function processAction(
  ctx: Context,
  action: TimelineEntry,
  initialBuffMap: Map<CHARACTER_KEY, BuffMap>,
  passiveBuffs: Map<CHARACTER_KEY, BuffInstance[]>,
  allBuffs: BuffDefinition[],
) {
  // update ctx
  ctx.onFieldChar =
    action.type === "cast" ? action.characterId : ctx.onFieldChar
  ctx.time = action.time
  ctx.buffMap = structuredClone(initialBuffMap)

  // remove expired buffs
  removeExpiredBuffs(ctx, action)

  // add outro buffs
  addOnSwapBuffs(ctx, action)

  // add triggered buffs
  addTriggeredBuffs(ctx, action, allBuffs)

  // evaluate buffs
  evaluateBuffs(ctx, action)

  // handle team buff
  evaluateBuffsGlobal(ctx, action)

  // evaluate dynamic conditions (concerto, resonance)
  evaluateDCond(ctx, action)

  const damage = calculateDamage(ctx, action)

  const { characterId, type, skill } = action
  const buffs =
    ctx.activeBuffs.get(characterId) ?? new Map<string, BuffInstance>()
  const buffsPassive =
    passiveBuffs.get(characterId) ?? new Map<string, BuffInstance>()
  const buffsPassiveArray = [...buffsPassive.values()].map((buff) => buff.name)
  const buffsCharacter = [...buffs.values()].map((buff) => buff.name)
  const buffsTeam = [...ctx.activeBuffsTeam.values()].map((buff) => buff.name)

  const buffMapCharacter = ctx.buffMap.get(characterId) ?? totalBuffMap

  const resultObject: Result = {
    row: ctx.row,
    characterId,
    type,
    skill,
    time: ctx.time,
    concerto: ctx.characters.get(characterId)?.dCond.concerto ?? 0,
    resonance: ctx.characters.get(characterId)?.dCond.resonance ?? 0,
    damage,
    proc: { ...ctx.proc },
    parent: action?.parent,
    buffs: [...buffsPassiveArray, ...buffsCharacter],
    buffsTeam: [...buffsTeam],
    buffMap: buffMapCharacter,
    message: {},
  }

  // setup for next iteration
  ctx.prevChar = ctx.onFieldChar
  ctx.proc = { damage: 0, heal: 0, shield: 0 }
  ctx.row += 1
  return resultObject
}

function getBuffData(characters: Map<CHARACTER_KEY, Character>) {
  const allBuffs: BuffDefinition[] = []

  for (const [characterId, character] of characters) {
    const sequence = character.sequence

    // Character buffs
    const cBuffData = buffs[characterId]
    if (cBuffData) {
      for (const buff of cBuffData) {
        const sequenceRequirement = buff.sequenceReq ?? 0
        if (sequenceRequirement > sequence) continue

        allBuffs.push({
          ...buff,
          duration: buff.duration * 60,
          ...(buff.cooldown && {
            cooldown: buff.cooldown * 60,
          }),
        })
      }
    }

    // Weapon buffs
    const weapon = character.weapon
    const wBuffData = weaponBuffs[weapon.name]

    if (wBuffData) {
      const rankIndex = Math.max(0, weapon.rank - 1)

      for (const buff of wBuffData) {
        allBuffs.push({
          ...buff,
          duration: buff.duration * 60,
          modifiers: [buff.modifiers[rankIndex]],
          appliesTo: characterId,
          source: characterId,
        })
      }
    }

    // Set buffs
    const echoSetName = character.echoSet[0]
    const sBuffData = setBuffs[echoSetName]

    if (sBuffData) {
      for (const buff of sBuffData) {
        const appliesTo =
          buff.appliesTo === "self" ? characterId : buff.appliesTo

        allBuffs.push({
          ...buff,
          duration: buff.duration * 60,
          source: characterId,
          appliesTo,
        })
      }
    }

    // Echo buffs
    const echoName = character.echo
    const eBuffData = echoBuffs[echoName]

    if (eBuffData) {
      for (const buff of eBuffData) {
        const appliesTo =
          buff.appliesTo === "self" ? characterId : buff.appliesTo

        allBuffs.push({
          ...buff,
          duration: buff.duration * 60,
          source: characterId,
          appliesTo,
        })
      }
    }
  }

  return allBuffs
}

function prepareBuffs(
  characters: Map<CHARACTER_KEY, Character>,
  allBuffs: BuffDefinition[],
) {
  // Initialize passiveBuffs as a Map
  const passiveBuffs = new Map<CHARACTER_KEY, BuffInstance[]>()
  const allowedKeys: (CHARACTER_KEY | "all" | "current" | "next")[] = [
    "all",
    "current",
    "next",
  ]

  for (const [characterId] of characters) {
    passiveBuffs.set(characterId, [])
    allowedKeys.push(characterId) // CHARACTER_KEY of team only
  }

  const nonPassiveBuffs: BuffDefinition[] = []

  for (const buff of allBuffs) {
    // non-passive buffs under 500s
    if (buff.duration < 500 * 60) {
      nonPassiveBuffs.push(buff)
    } else {
      if (buff.source === "self") continue
      if (!allowedKeys.some((key) => key === buff.appliesTo)) continue

      const buffsArray = passiveBuffs.get(buff.source)
      if (!buffsArray) continue

      buffsArray.push({
        ...buff,
        endTime: 99999,
      })
    }
  }

  return { passiveBuffs, nonPassiveBuffs }
}

function getBuffMap(
  characters: Map<CHARACTER_KEY, Character>,
  buffMap: BuffMap,
  passiveBuffs: Map<CHARACTER_KEY, BuffInstance[]>,
): Map<CHARACTER_KEY, BuffMap> {
  const initialBuffMap = new Map<CHARACTER_KEY, BuffMap>()

  for (const [characterId, character] of characters) {
    const personalBuffMap: BuffMap = { ...buffMap }

    // Apply BonusStats
    for (const key of BONUSSTAT_KEYS) {
      if (key in personalBuffMap) {
        const sharedKey = key as BONUSSTAT_KEY & BUFF_TYPE
        personalBuffMap[sharedKey] += character.bonusStats[sharedKey]
      }
    }

    // Apply passive buff stats
    const buffs = passiveBuffs.get(characterId) ?? []
    for (const buff of buffs) {
      for (const modifier of buff.modifiers) {
        const key = modifier.class
        if (key === "allEle") {
          for (const element of ELEMENT_KEYS) {
            personalBuffMap[element] += modifier.value
          }
        } else {
          personalBuffMap[key] += modifier.value
        }
      }
    }

    initialBuffMap.set(characterId, personalBuffMap)
  }

  return initialBuffMap
}

function getContext(
  characterData: Map<CHARACTER_KEY, Character>,
  baseBuffMap: Map<CHARACTER_KEY, BuffMap>,
): Context {
  const characters = new Map(
    Array.from(characterData, ([key, value]) => [key, structuredClone(value)]),
  )

  const activeBuffs = new Map<CHARACTER_KEY, Map<string, BuffInstance>>()
  for (const [characterId] of characters) {
    activeBuffs.set(characterId, new Map<string, BuffInstance>())
  }
  const activeBuffsTeam = new Map<string, BuffInstance>()
  const buffDeferred = new Map<string, BuffInstance>()
  const buffNext = new Map<string, BuffInstance>()

  // Proc stats
  const proc = { damage: 0, heal: 0, shield: 0 }

  const mode = new Map<CHARACTER_KEY | "all", Map<string, BuffInstance>>()
  mode.set("all", new Map<string, BuffInstance>())
  for (const [characterId] of characters) {
    mode.set(characterId, new Map<string, BuffInstance>())
  }

  return {
    activeBuffs,
    activeBuffsTeam,
    onFieldChar: "",
    buffMap: baseBuffMap,
    buffDeferred,
    buffNext,
    characters,
    cooldowns: {},
    hasSwapped: false,
    mode,
    prevChar: "",
    proc,
    row: 1,
    time: 0,
    message: {},
  }
}

function calculate(
  characterData: Character[],
  actionList: TimelineEntry[],
  baseBuffMap: BuffMap,
): Result[] {
  const resultList: Result[] = []

  const characters = new Map<CHARACTER_KEY, Character>()
  characterData.forEach((character) => {
    characters.set(character.id, character)
  })

  // get Data
  const buffData = getBuffData(characters)

  // process passive Buffs
  const { passiveBuffs, nonPassiveBuffs } = prepareBuffs(characters, buffData)
  console.log("passiveBuffs", passiveBuffs)
  console.log("nonPassiveBuffs", nonPassiveBuffs)

  // process character and passive buff stats
  const initialBuffMap = getBuffMap(characters, baseBuffMap, passiveBuffs)

  // global mutable context
  const ctx = getContext(characters, initialBuffMap)

  // calculation loop
  for (const action of actionList) {
    const result = processAction(
      ctx,
      action,
      initialBuffMap,
      passiveBuffs,
      nonPassiveBuffs,
    )
    resultList.push(result)
  }
  return resultList
}

export {
  removeExpiredBuffs,
  addOnSwapBuffs,
  addTriggeredBuffs,
  handleEnergyShare,
  evaluateDCond,
  calculateDamage,
  evaluateBuffs,
  evaluateBuffsGlobal,
  processAction,
  getBuffData,
  getBuffMap,
  prepareBuffs,
  getContext,
  calculate,
}
