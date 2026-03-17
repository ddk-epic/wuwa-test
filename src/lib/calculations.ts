import {
  ELEMENT,
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
  getBonus,
  getDefMultiplier,
  getResMultiplier,
  hasOffFieldBuff,
  hasSwapped,
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
  const currentTime = ctx.time
  const buffsToRemove = new Set<ActiveBuffObject>()
  const buffs = ctx.activeBuffs[characterId]

  for (const buff of buffs) {
    // filter by endtime
    if (buff.endTime <= currentTime) {
      buffsToRemove.add(buff)
    }

    // filter off-field buffs if character is on-field
    if (hasOffFieldBuff(buff) && isOnField(characterId, ctx.onFieldChar)) {
      buffsToRemove.add(buff)
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

  for (const buff of ctx.allBuffs) {
    //  preliminary checks
    if (buff.source !== characterId) continue

    // off-field buff check
    const offFieldCheck =
      hasOffFieldBuff(buff) && isOnField(characterId, ctx.onFieldChar)
    if (offFieldCheck) continue

    const isAlreadyActive = [...buffs].some((b) => b.id === buff.id)
    if (isAlreadyActive) continue

    const sequenceRequirement = buff.sequenceReq ?? 0
    if (sequenceRequirement > ctx.characters[characterId].sequence) continue

    // add buff if match
    const match = isMatch(buff.triggeredBy, skill)
    if (!match) continue

    // handle end time (convert to activeBuffObject)
    const endTime = currentTime + buff.duration
    const activeBuffObject =
      buff.type !== "BuffStacking"
        ? { ...buff, endTime }
        : { ...buff, stackCount: 0, endTime }
    // handle outro
    if (buff.type === "BuffNext" && buff.appliesTo === "Next") {
      ctx.buffNext.push(activeBuffObject)
      // console.log(`add ${activeBuffObject.name} to buffNext`)
      continue
    }

    // handle damage proc
    if (buff.type === "Damage" && buff.consumedBy) {
      ctx.buffDeferred.push(activeBuffObject)
      // console.log(`add ${activeBuffObject.name} to buffDeferred`)
    }

    buffs.push(activeBuffObject)
    // console.log(
    //   `add ${activeBuffObject.name} to activeBuffs[${characterId}]`,
    // )
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
  if (skill.classifications.includes("liberation")) {
    character.dCond.resonance = 0
  }
  handleEnergyShare(ctx, action)

  // handle concerto
  character.dCond.concerto += skill.concerto
}

function calculateDamage(ctx: Context, action: TimelineItem) {
  if (action.type === "parent") return 0

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

  for (const buff of buffs) {
    let currentModifiers = buff.modifiers

    // off-field buff check
    const offFieldCheck =
      hasOffFieldBuff(buff) && isOnField(characterId, ctx.onFieldChar)
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

      case "BuffConsume":
        break

      case "DCondFlat":
        // add flat DCond mod to stat
        const mod = buff.modifiers[0]
        if (isDCondKey(mod.class)) {
          character.dCond[mod.class] += mod.value
        }
        console.log(`(${ctx.row}) ${characterId} ${buff.name} dCond[${mod.class}]: (${mod.value})`)
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
      // console.log(`(${ctx.row}) evaluateBuffs: default (${buff.name})`)
    }
    // switch end
    if (!buff.type.includes("Buff")) continue

    for (const modifier of currentModifiers) {
      const value = modifier.stackValue ? modifier.stackValue : modifier.value

      if (modifier.class !== "allEle") {
        ctx.buffMap[characterId][modifier.class] += value
      } else {
        for (const element of ELEMENT) {
          ctx.buffMap[characterId][element] += value
        }
      }
      // console.log(
      //   `(${ctx.row}) (${buff.name}) buffMap[${characterId}][${modifier.class}]: ${ctx.buffMap[characterId][modifier.class]} (+${value})`,
      // )
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
  ctx.onFieldChar = action.type === "parent" ? action.char : ctx.onFieldChar
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
  const buffsPassive = passiveBuffs[characterId].map((buff) => buff.name)
  const buffsCharacter = buffs.map((buff) => buff.name)

  const roundedBuffMap: Record<keyof BuffMap, string> =
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
    buffMap: buffMapValues,
  }

  // setup for next iteration
  ctx.prevChar = ctx.onFieldChar
  ctx.proc = { damage: 0, heal: 0, shield: 0 }
  ctx.row += 1
  return resultObject
}

function getBuffData(characters: Record<CHARACTER_KEY, Character>) {
  const team = Object.keys(characters) as CHARACTER_KEY[]

  const characterBuffData: BuffObject[] = team.flatMap((charName) =>
    buffs[charName].map((buff) => ({
      ...buff,
      duration: buff.duration * 60, // convert to frames
    })),
  )

  const weaponBuffData: BuffObject[] = team
    .map((characterId) => {
      const character = characters[characterId]
      const sequence = character.sequence
      const getWeaponBuffs = weaponBuffs[character.weapon.name]

      // update WeaponBuffObject
      if (!getWeaponBuffs) return []

      return getWeaponBuffs.map((buff) => {
        const returnObj = {
          ...buff,
          duration: buff.duration * 60, // convert to frames
          modifiers: [buff.modifiers[Math.max(0, sequence - 1)]],
          appliesTo: characterId,
          source: characterId,
        } as BuffObject
        return returnObj
      })
    })
    .flat()

  const setBuffData: BuffObject[] = team
    .map((characterId) => {
      // TODO: proper handling
      const echoName = characters[characterId].echoSet[0]
      const getSetBuffs = setBuffs[echoName]

      return getSetBuffs.map((buff) => {
        const appliesTo =
          buff.appliesTo === "Self" ? characterId : buff.appliesTo
        const buffObj = {
          ...buff,
          duration: buff.duration * 60, // convert to frames
          source: characterId,
          appliesTo,
        } as BuffObject

        return buffObj
      })
    })
    .flat()

  const echoBuffData: BuffObject[] = team
    .map((characterId) => {
      const echoName = characters[characterId].echo
      const getEchoBuffs = echoBuffs[echoName]

      return getEchoBuffs.map((buff) => {
        const appliesTo =
          buff.appliesTo === "Self" ? characterId : buff.appliesTo
        const buffObj = {
          ...buff,
          duration: buff.duration * 60, // convert to frames
          source: characterId,
          appliesTo,
        } as BuffObject

        return buffObj
      })
    })
    .flat()

  const allBuffs = [
    ...characterBuffData,
    ...weaponBuffData,
    ...setBuffData,
    ...echoBuffData,
  ]

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
    if (buff.duration < 999) {
      nonPassiveBuffs.push(buff)
    } else {
      if (buff.source === "Self") continue
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
            for (const element of ELEMENT) {
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
  const proc = { damage: 0, heal: 0, shield: 0 }

  return {
    activeBuffs,
    onFieldChar: "",
    allBuffs: nonPassiveBuffs,
    buffMap: baseBuffMap,
    buffDeferred: [],
    buffNext: [],
    characters,
    hasSwapped: false,
    prevChar: "",
    proc,
    row: 1,
    time: 0,
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

  // process character and passive buff stats
  const initialBuffMap = getBuffMap(characters, baseBuffMap, passiveBuffs)

  // global mutable context
  const ctx = getContext(characters, initialBuffMap, nonPassiveBuffs)
  console.log(nonPassiveBuffs)

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
