import {
  ELEMENT_KEYS,
  type ActiveBuffObject,
  type BUFF_TYPE,
  type BuffMap,
  type BuffObject,
  type Character,
  type Context,
  type Result,
  type Skill,
  type TimelineItem,
} from "@/constants/types"

import { roundBuffMapToPercentStrings } from "./utils"

import {
  buffHandler,
  canTriggerBuff,
  getBonus,
  getDefMultiplier,
  getResMultiplier,
  isOffFieldBuff,
  hasSwapped,
  isActionType,
  isDCondKey,
  isMatch,
  isOnField,
  removeBuffByName,
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
import { getSkillLevel } from "@/constants/maps"

function removeExpiredBuffs(ctx: Context, action: TimelineItem) {
  const characterId = action.char
  const skill = action.skill
  const currentTime = ctx.time
  const buffsToRemove = new Set<ActiveBuffObject>()
  const buffs = ctx.activeBuffs[characterId]
  const buffsTeam = ctx.activeBuffsTeam

  for (const buffArray of [buffs, buffsTeam])
    for (const buff of buffArray) {
      // filter by endtime
      if (buff.endTime <= currentTime) {
        buffsToRemove.add(buff)
      }

      // filter off-field buffs if character is on-field
      if (isOffFieldBuff(buff) && isOnField(characterId, ctx.onFieldChar)) {
        buffsToRemove.add(buff)
      }

      // filter consumed buffs
      if (buff.type === "BuffToConsume" && buff.consumedBy) {
        for (const consume of buff.consumedBy) {
          if (consume === skill.id) {
            buffsToRemove.add(buff)
            ctx.mode[characterId].pop() // TODO: testing needed
          }
        }
      }

      // other filter rules
    }

  // remove buffs
  ctx.activeBuffs[characterId] = buffs.filter(
    (buff) => !buffsToRemove.has(buff),
  )
}

function addOnSwapBuffs(ctx: Context, action: TimelineItem) {
  const characterId = action.char
  const currentTime = ctx.time
  const buffNext = ctx.buffNext

  if (!hasSwapped(ctx.prevChar, characterId) || buffNext.length === 0) return

  for (const buff of buffNext) {
    const isAlreadyActive = ctx.activeBuffs[characterId].some(
      (b) => b.id === buff.id,
    )
    if (isAlreadyActive) continue

    // add end time
    const endTime = currentTime + buff.duration
    const activeBuffObject = { ...buff, endTime }

    ctx.activeBuffs[characterId].push(activeBuffObject)
    // console.log(
    //   `add ${activeBuffObject.name} to activeBuffs[${characterId}]`,
    // )
  }
}

function addTriggeredBuffs(ctx: Context, action: TimelineItem) {
  const characterId = action.char
  const skill = action.skill
  const currentTime = ctx.time
  const buffs = ctx.activeBuffs[characterId]
  const buffsTeam = ctx.activeBuffsTeam

  for (const buff of ctx.allBuffs) {
    //  preliminary checks
    if (buff.source !== characterId) continue

    const match = isMatch(buff.triggeredBy, skill)
    if (!match) continue

    if (!canTriggerBuff(ctx, buff.id)) continue
    if (!isActionType(buff, action)) continue

    const isAlreadyActive = buffs.some((b) => b.id === buff.id)
    const isAlreadyActiveTeam = buffsTeam.some((b) => b.id === buff.id)
    if (isAlreadyActive || isAlreadyActiveTeam) continue

    const sequenceRequirement = buff.sequenceReq ?? 0
    if (sequenceRequirement > ctx.characters[characterId].sequence) continue

    const offFieldCheck =
      isOffFieldBuff(buff) && isOnField(characterId, ctx.onFieldChar) // off-field buff check
    if (offFieldCheck) continue

    // handle end time (convert to activeBuffObject)
    const endTime = currentTime + buff.duration
    const activeBuffObject =
      buff.type !== "BuffStacking"
        ? { ...buff, endTime }
        : { ...buff, stackCount: 0, endTime }

    // handle outro
    if (buff.type === "BuffNext" && buff.appliesTo === "next") {
      ctx.buffNext.push(activeBuffObject)
      // console.log(`add ${activeBuffObject.name} to buffNext`)
      continue
    }

    // handle mode
    if (buff.type === "Mode") {
      ctx.mode[characterId].push(activeBuffObject.id)
    }

    // handle damage proc
    if (buff.type === "Damage" && buff.consumedBy) {
      ctx.buffDeferred.push(activeBuffObject)
      // console.log(`add ${activeBuffObject.name} to buffDeferred`)
    }

    const buffArray = buff.appliesTo === "all" ? buffsTeam : buffs
    buffArray.push(activeBuffObject)
    // console.log(
    //   ctx.row, `add ${activeBuffObject.name}`,
    // )

    if (buff.cooldown) {
      ctx.cooldowns[buff.id] = ctx.time + buff.cooldown
      // console.log(ctx.row, `cooldowns[${buff.id}]:`, ctx.cooldowns[buff.id])
    }
  }
}

function handleEnergyShare(ctx: Context, action: TimelineItem) {
  const value = action.skill.resonance
  for (const character of Object.values(ctx.characters)) {
    const activeMultiplier = character.id === action.char ? 1 : 0.5

    character.dCond.resonance += value * activeMultiplier
  }
}

function evaluateDCond(ctx: Context, action: TimelineItem) {
  const characterId = action.char
  const character = ctx.characters[characterId]
  const skill = action.skill

  // handle resonance energy
  if (action.type === "cast" && skill.category === "liberation") {
    character.dCond.resonance = 0
  }
  handleEnergyShare(ctx, action)

  // handle concerto
  character.dCond.concerto += skill.concerto
}

function calculateDamage(ctx: Context, action: TimelineItem) {
  if (action.type === "cast") return 0

  const characterId = action.char
  const skill = action.skill
  const char = ctx.characters[characterId]
  const buffMap = ctx.buffMap[characterId]

  // character
  const characterLevel = 90
  const skillLevel = 10
  const attack = char.atk * (1 + buffMap.atk) + char.bonusStats.atkFlat
  const skillMultiplier =
    action.skill.mv * getSkillLevel[skillLevel] * (1 + buffMap.multiplier)
  const bonusMultiplier = 1 + getBonus(buffMap, skill.classifications)
  const deepenMultiplier = 1
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

  const totalDamage =
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
  //   crit,
  //   critDmg,
  //   res: resMultiplier,
  //   def: enemyDefenseMultiplier,
  // })
  // console.table({enemyDefenseMultiplier})

  return totalDamage
}

function evaluateBuffs(ctx: Context, action: TimelineItem) {
  const characterId = action.char
  const character = ctx.characters[characterId]
  const skill = action.skill
  const time = action.time
  const buffs = ctx.activeBuffs[characterId]
  const buffsTeam = ctx.activeBuffsTeam

  for (const buffArray of [buffs, buffsTeam]) {
    for (const buff of buffArray) {
      let currentModifiers = buff.modifiers

      // off-field buff check
      const offFieldCheck =
        isOffFieldBuff(buff) && isOnField(characterId, ctx.onFieldChar)
      if (offFieldCheck) continue

      switch (buff.type) {
        case "BuffStacking":
          if (action.type !== "hit") break
          const match = isMatch(buff.triggeredBy, skill)
          if (!match) break

          const handler = buffHandler["BuffStacking"]
          const newModifiers = handler.onTrigger(buff, time)

          if (!newModifiers) break

          buff.modifiers = newModifiers
          currentModifiers = newModifiers
          break

        case "BuffToConsume":
          break

        case "DCondFlat":
          // add flat DCond mod to stat
          const mod = buff.modifiers[0]
          if (isDCondKey(mod.class)) {
            character.dCond[mod.class] += mod.value
          }
          // console.log(
          //   ctx.row,
          //   `${characterId} ${buff.name} dCond[${mod.class}]:`,
          //   mod.value,
          // )
          break

        case "Damage":
          for (const buff of [...ctx.buffDeferred]) {
            if (!(buff.consumedBy && buff.consumedBy.includes(skill.id))) break

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
            const procEvent: TimelineItem = {
              char: characterId,
              type: "hit",
              skill: damageProc,
              time,
            }
            ctx.proc.damage = calculateDamage(ctx, procEvent)
            evaluateDCond(ctx, procEvent)
            removeBuffByName(ctx.activeBuffs[characterId], buff.id)
            removeBuffByName(ctx.buffDeferred, buff.id)
            // console.log(
            //   `${damageProcc.name} successfully procced for`,
            //   ctx.proc.damage,
            // )
          }
          break

        default:
        // console.log(ctx.row, `evaluateBuffs: default (${buff.name})`)
      }
      // switch end
      if (!buff.type.includes("Buff")) continue

      for (const modifier of currentModifiers) {
        const value = modifier.stackValue ? modifier.stackValue : modifier.value

        if (buff.appliesTo === "all") {
          for (const character of Object.values(ctx.characters)) {
            ctx.buffMap[character.id][modifier.class] += value
            // console.log(
            //   ctx.row,
            //   buff.name,
            //   `buffMap[${character.id}][${modifier.class}]:`,
            //   ctx.buffMap[character.id][modifier.class],
            //   `+${value}`,
            // )
          }
          return
        }

        if (modifier.class === "allEle") {
          for (const element of ELEMENT_KEYS) {
            ctx.buffMap[characterId][element] += value
          }
          return
        }

        ctx.buffMap[characterId][modifier.class] += value
        // console.log(
        //   ctx.row,
        //   buff.name, `buffMap[${characterId}][${modifier.class}]:`, ctx.buffMap[characterId][modifier.class]
        // )
      }
    }
  }
}

function processAction(
  ctx: Context,
  action: TimelineItem,
  initialBuffMap: Record<CHARACTER_KEY, BuffMap>,
  passiveBuffs: Record<CHARACTER_KEY, ActiveBuffObject[]>,
) {
  // update ctx
  ctx.onFieldChar = action.type === "cast" ? action.char : ctx.onFieldChar
  ctx.time = action.time
  ctx.buffMap = structuredClone(initialBuffMap)

  // remove expired buffs
  removeExpiredBuffs(ctx, action)

  // add outro buffs
  addOnSwapBuffs(ctx, action)

  // add triggered buffs
  addTriggeredBuffs(ctx, action)

  // evaluate buffs
  evaluateBuffs(ctx, action)

  // handle team buff

  // evaluate dynamic conditions (concerto, resonance)
  evaluateDCond(ctx, action)

  const damage = calculateDamage(ctx, action)

  const characterId = action.char
  const buffs = ctx.activeBuffs[characterId]
  const buffsTeam = ctx.activeBuffsTeam.map((buff) => buff.name)
  const buffsPassive = passiveBuffs[characterId].map((buff) => buff.name)
  const buffsCharacter = buffs.map((buff) => buff.name)

  const roundedBuffMap: Record<BUFF_TYPE, string> =
    roundBuffMapToPercentStrings(ctx.buffMap[characterId])
  const buffMapValues = Object.values(roundedBuffMap).slice(0, 33)

  const resultObject: Result = {
    row: ctx.row,
    char: characterId,
    type: action.type,
    skill: action.skill,
    time: ctx.time,
    concerto: ctx.characters[characterId].dCond.concerto,
    resonance: ctx.characters[characterId].dCond.resonance,
    damage,
    proc: { ...ctx.proc },
    parent: action?.parent,
    buffs: [...buffsPassive, ...buffsCharacter],
    buffsTeam: [...buffsTeam],
    buffMap: buffMapValues,
    message: {},
  }

  // setup for next iteration
  ctx.prevChar = ctx.onFieldChar
  ctx.proc = { damage: 0, heal: 0, shield: 0 }
  ctx.row += 1
  return resultObject
}

function getBuffData(characters: Record<CHARACTER_KEY, Character>) {
  const team = Object.keys(characters) as CHARACTER_KEY[]

  const allBuffs: BuffObject[] = []

  for (const characterId of team) {
    const character = characters[characterId]
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
  characters: Record<CHARACTER_KEY, Character>,
  allBuffs: BuffObject[],
) {
  const team = Object.keys(characters) as CHARACTER_KEY[]

  const passiveBuffs = team.reduce(
    (acc, characterId) => {
      acc[characterId] = []
      return acc
    },
    {} as Record<CHARACTER_KEY, ActiveBuffObject[]>,
  )
  const nonPassiveBuffs = [] as BuffObject[]

  for (const buff of allBuffs) {
    if (buff.duration < 500 * 60) {
      nonPassiveBuffs.push(buff)
    } else {
      if (buff.source === "self") continue
      passiveBuffs[buff.source].push({
        ...buff,
        endTime: 99999,
      })
    }
  }

  return { passiveBuffs, nonPassiveBuffs }
}

function getBuffMap(
  characters: Record<CHARACTER_KEY, Character>,
  buffMap: BuffMap,
  passiveBuffs: Record<CHARACTER_KEY, ActiveBuffObject[]>,
): Record<CHARACTER_KEY, BuffMap> {
  const team = Object.keys(characters) as CHARACTER_KEY[]

  const initialBuffMap: Record<CHARACTER_KEY, BuffMap> = team.reduce(
    (acc, characterId) => {
      const bonusStats = characters[characterId].bonusStats
      const personalBuffMap = { ...buffMap }

      // apply BonusStats
      BONUSSTAT_KEYS.forEach((key) => {
        if (key in personalBuffMap) {
          const sharedKey = key as BONUSSTAT_KEY & BUFF_TYPE
          personalBuffMap[sharedKey] += bonusStats[sharedKey]
        }
      })

      // apply passive buff stats
      passiveBuffs[characterId].forEach((buff) => {
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
      })

      acc[characterId] = personalBuffMap
      return acc
    },
    {} as Record<CHARACTER_KEY, BuffMap>,
  )

  return initialBuffMap
}

function getContext(
  characterData: Record<CHARACTER_KEY, Character>,
  baseBuffMap: Record<CHARACTER_KEY, BuffMap>,
  nonPassiveBuffs: BuffObject[],
): Context {
  const team = Object.keys(characterData) as CHARACTER_KEY[]
  const characters = structuredClone(characterData)
  const activeBuffs = team.reduce(
    (acc, characterId) => {
      acc[characterId] = []
      return acc
    },
    {} as Record<CHARACTER_KEY, ActiveBuffObject[]>,
  )
  const activeBuffsTeam = [] as ActiveBuffObject[]
  const proc = { damage: 0, heal: 0, shield: 0 }
  const mode = team.reduce(
    (acc, characterId) => {
      acc[characterId] = []
      return acc
    },
    {} as Record<CHARACTER_KEY, string[]>,
  )

  return {
    activeBuffs,
    activeBuffsTeam,
    onFieldChar: "",
    allBuffs: nonPassiveBuffs,
    buffMap: baseBuffMap,
    buffDeferred: [],
    buffNext: [],
    characters,
    cooldowns: {},
    hasSwapped: false,
    mode, // priority stack
    prevChar: "",
    proc,
    row: 1,
    time: 0,
    message: {},
  }
}

function calculate(
  characters: Record<CHARACTER_KEY, Character>,
  actionList: TimelineItem[],
  baseBuffMap: BuffMap,
): Result[] {
  const resultList: Result[] = []

  // get Data
  const buffData = getBuffData(characters)

  // process passive Buffs
  const { passiveBuffs, nonPassiveBuffs } = prepareBuffs(characters, buffData)
  console.log(passiveBuffs)
  console.log(nonPassiveBuffs)

  // process character and passive buff stats
  const initialBuffMap = getBuffMap(characters, baseBuffMap, passiveBuffs)

  // global mutable context
  const ctx = getContext(characters, initialBuffMap, nonPassiveBuffs)

  // calculation loop
  for (const action of actionList) {
    const result = processAction(ctx, action, initialBuffMap, passiveBuffs)
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
  processAction,
  getBuffData,
  getBuffMap,
  prepareBuffs,
  getContext,
  calculate,
}
