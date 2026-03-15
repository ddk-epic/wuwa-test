import {
  ELEMENT,
  type ActiveBuffObject,
  type BonusStats,
  type BuffMap,
  type BuffObject,
  type BuffType,
  type Character,
  type Context,
  type Result,
  type Skill,
  type TimelineItem,
} from "@/constants/types"

import {
  getBaseBuffName,
  getBaseSkillName,
  roundBuffMapToPercentStrings,
} from "./utils"

import { buffHandler, hasSwapped, isMatch, removeBuffByName } from "./helper"

import type { CHARACTER_KEY } from "@/constants/characters"
import { buffs } from "./effects/buffs"
import { echoBuffs } from "./effects/echo-buffs"
import { setBuffs } from "./effects/set-buffs"
import { weaponBuffs } from "./effects/weapon-buffs"

function removeExpiredBuffs(ctx: Context, action: TimelineItem) {
  const character = action.char
  const currentTime = ctx.time
  const buffsToRemove = new Set<ActiveBuffObject>()
  const buffs = ctx.activeBuffs[character]

  if (!buffs) return

  // filter by endtime
  for (const buff of ctx.activeBuffs[character]) {
    if (buff.endTime * 60 <= currentTime) {
      // frame time
      buffsToRemove.add(buff)
    }
  }

  // other filter rules

  // remove buffs
  ctx.activeBuffs[character] = ctx.activeBuffs[character].filter(
    (buff) => !buffsToRemove.has(buff),
  )
}

function addOnSwapBuffs(ctx: Context, action: TimelineItem) {
  const character = action.char
  const currentTime = ctx.time
  const buffNext = ctx.buffNext

  if (!hasSwapped(ctx.prevChar, character) || buffNext.length === 0) return

  for (const buff of buffNext) {
    const isAlreadyActive = ctx.activeBuffs[character].some(
      (b) => getBaseBuffName(b.name) === getBaseBuffName(buff.name),
    )

    // add end time
    if (!isAlreadyActive) {
      const endTime = (currentTime + buff.duration * 60) / 60 // frame time
      const activeBuffObject = { ...buff, endTime }

      ctx.activeBuffs[character].push(activeBuffObject)
      // console.log(
      //   `add ${activeBuffObject.name} to activeBuffs[${character}]`,
      // )
    }
  }
}

function addTriggeredBuffs(ctx: Context, action: TimelineItem) {
  const character = action.char
  const skill = action.skill
  const currentTime = ctx.time
  const buffs = ctx.activeBuffs[character]

  if (!buffs) return

  for (const buff of ctx.allBuffs) {
    //  preliminary checks
    if (buff.source !== character) continue

    const isAlreadyActive = ctx.activeBuffs[character].some(
      (b) => getBaseBuffName(b.name) === getBaseBuffName(buff.name),
    )
    if (isAlreadyActive) continue

    const sequenceRequirement = buff.sequenceReq ?? 0
    if (sequenceRequirement > ctx.characters[character].sequence) continue

    // add buff if match
    const match = isMatch(buff.triggeredBy, skill)
    if (!match) continue

    // handle end time (convert to frame time)
    const endTime =
      (currentTime + buff.duration * 60 - (skill.freezetime ?? 0)) / 60
    const stackCount = 0
    const activeBuffObject =
      buff.type !== "BuffStacking"
        ? { ...buff, endTime }
        : { ...buff, stackCount, endTime }

    // handle outro
    if (buff.type === "BuffNext" && buff.appliesTo === "Next") {
      ctx.buffNext.push(activeBuffObject)
      // console.log(`add ${activeBuffObject.name} to buffNext`)
      continue
    }

    // handle damage procc
    if (buff.type === "Damage" && buff.consumedBy) {
      ctx.buffDeferred.push(activeBuffObject)
      // console.log(`add ${activeBuffObject.name} to buffDeferred`)
    }

    ctx.activeBuffs[character].push(activeBuffObject)
    // console.log(
    //   `add ${activeBuffObject.name} to activeBuffs[${activeCharacter}]`,
    // )
  }
}

function handleEnergyShare(ctx: Context, action: TimelineItem) {
  const value = action.skill.resonance
  for (const character of Object.values(ctx.characters)) {
    const activeMultiplier = character.id === action.char ? 1 : 0.5

    character.dCond.Resonance += value * activeMultiplier
  }
}

function evaluateDCond(ctx: Context, action: TimelineItem) {
  const character = ctx.characters[action.char]
  const skill = action.skill

  // handle resonance energy
  if (skill.classifications.includes("liberation")) {
    character.dCond.Resonance = 0
  }
  handleEnergyShare(ctx, action)

  // handle concerto
  character.dCond.Concerto += skill.concerto
}

function calculateDamage(ctx: Context, action: TimelineItem) {
  const characterId = action.char
  const char = ctx.characters[characterId]
  const enemyDefenseMultiplier = 0.52

  if (action.type === "parent") return 0

  const attack =
    char.atk * (1 + ctx.buffMap[characterId].atk) + char.bonusStats.atkFlat
  const damage =
    attack * action.skill.mv * (1 + ctx.buffMap[characterId].multiplier)
  const crit = Math.min(char.crit + ctx.buffMap[characterId].crit, 1)
  const critDmg = char.critDmg + ctx.buffMap[characterId].critDmg
  const critMultiplier = critDmg - crit + crit * critDmg

  const totalDamage = damage * critMultiplier * enemyDefenseMultiplier
  // console.log(skill.name, attack, damage, totalDamage)
  return totalDamage
}

function evaluateBuffs(ctx: Context, action: TimelineItem) {
  const character = action.char
  const skill = action.skill
  const time = action.time
  const buffs = ctx.activeBuffs[character]

  if (!buffs) return

  for (const buff of buffs) {
    switch (buff.type) {
      case "BuffStacking":
        if (action.type !== "hit") break
        const match = isMatch(buff.triggeredBy, skill)
        if (!match) break

        const handler = buffHandler["BuffStacking"]
        const modifierDeltas = handler.onTrigger(buff, time)

        if (!modifierDeltas) break
        for (const modifier of modifierDeltas) {
          ctx.buffMap[character][modifier.class] += modifier.value
          // console.log(
          //   `(${ctx.row}) BuffStacking buffMap[${character}][${modifier.class}]: ${ctx.buffMap[character][modifier.class]}`,
          // )
        }
        break

      case "BuffConsume":
        break

      case "Damage":
        const baseName = getBaseSkillName(skill.name)

        for (const buff of [...ctx.buffDeferred]) {
          if (!(buff.consumedBy && buff.consumedBy.includes(baseName))) break

          const damageProcc: Skill = {
            name: `${buff.name} Procc`,
            category: skill.category,
            classifications: skill.classifications,
            mv: buff.modifiers[0].value,
            frames: 0,
            hits: 1,
            forte: buff?.forte ?? 0,
            forte2: buff?.forte2 ?? 0,
            concerto: buff?.concerto ?? 0,
            resonance: buff?.resonance ?? 0,
          }
          const damageAction: TimelineItem = {
            char: character,
            type: "hit",
            skill: damageProcc,
            time: 0,
          }
          ctx.procc.damage = calculateDamage(ctx, damageAction)
          evaluateDCond(ctx, damageAction)
          removeBuffByName(ctx.activeBuffs[character], buff.name)
          removeBuffByName(ctx.buffDeferred, buff.name)
          // console.log(
          //   `${damageProcc.name} successfully procced for`,
          //   ctx.procc.damage,
          // )
        }
        break

      default:
        for (const modifier of buff.modifiers) {
          if (modifier.class === "allEle") {
            for (const element of ELEMENT) {
              ctx.buffMap[character][element] += modifier.value
            }
            // console.log(
            //   `(${ctx.row}) default (${buff.name}) buffMap[${character}][${modifier.class}]: ${modifier.value}`,
            // )
          } else {
            ctx.buffMap[character][modifier.class] += modifier.value
            // console.log(
            //   `(${ctx.row}) default (${buff.name}) buffMap[${character}][${modifier.class}]: ${ctx.buffMap[character][modifier.class]} (+${modifier.value})`,
            // )
          }
        }
    }
  }
}

function processAction(
  ctx: Context,
  action: TimelineItem,
  initialBuffMap: Record<string, BuffMap>,
  passiveBuffs: Record<string, ActiveBuffObject[]>,
) {
  // update ctx
  ctx.activeCharacter =
    action.type === "parent" ? action.char : ctx.activeCharacter
  ctx.time = action.time
  ctx.buffMap = structuredClone(initialBuffMap)

  const character = action.char
  const skill = action.skill
  const buffs = ctx.activeBuffs[character]

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

  const buffsPassive = passiveBuffs[character].map((buff) => buff.name)
  const buffsCharacter = buffs ? buffs.map((buff) => buff.name) : []

  const roundedBuffMap: Record<keyof BuffMap, string> =
    roundBuffMapToPercentStrings(ctx.buffMap[character])
  const buffMapValues = Object.values(roundedBuffMap).slice(0, 32)

  const resultObject: Result = {
    row: ctx.row,
    char: character,
    type: action.type,
    skill: skill,
    time: ctx.time,
    concerto: ctx.characters[character].dCond.Concerto,
    resonance: ctx.characters[character].dCond.Resonance,
    damage,
    procc: { ...ctx.procc },
    parent: action?.parent,
    buffs: [...buffsPassive, ...buffsCharacter],
    buffMap: buffMapValues,
  }

  // setup for next iteration
  ctx.prevChar = ctx.activeCharacter
  ctx.procc = { damage: 0, heal: 0, shield: 0 }
  ctx.row += 1
  return resultObject
}

function getBuffData(characters: Record<CHARACTER_KEY, Character>) {
  const team = Object.keys(characters) as CHARACTER_KEY[]

  const characterBuffData: BuffObject[] = team
    .map((charName) => buffs[charName] ?? [])
    .flat()

  const weaponBuffData: BuffObject[] = team
    .map((charName) => {
      const character = characters[charName]
      const sequence = character.sequence
      const getWeaponBuffs = weaponBuffs[character.weapon.name]

      // update WeaponBuffObject
      if (!getWeaponBuffs) return []

      return getWeaponBuffs.map((buff) => {
        const returnObj = {
          ...buff,
          modifiers: [buff.modifiers[Math.max(0, sequence - 1)]],
          appliesTo: charName,
          source: charName,
        } as BuffObject
        return returnObj
      })
    })
    .flat()

  const setBuffData: BuffObject[] = team
    .map((charName) => {
      // TODO: proper handling
      const echoName = characters[charName].echoSet[0]
      const getSetBuffs = setBuffs[echoName]

      return getSetBuffs.map((buff) => {
        const appliesTo = buff.appliesTo === "Self" ? charName : buff.appliesTo
        const buffObj = {
          ...buff,
          source: charName,
          appliesTo,
        } as BuffObject

        return buffObj
      })
    })
    .flat()

  const echoBuffData: BuffObject[] = team
    .map((charName) => {
      const echoName = characters[charName].echo
      const getEchoBuffs = echoBuffs[echoName]

      return getEchoBuffs.map((buff) => {
        const appliesTo = buff.appliesTo === "Self" ? charName : buff.appliesTo
        const buffObj = {
          ...buff,
          source: charName,
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

function getBuffMap(
  characters: Record<string, Character>,
  buffMap: BuffMap,
): Record<string, BuffMap> {
  const initialBuffMap: Record<string, BuffMap> = Object.keys(
    characters,
  ).reduce(
    (acc, character) => {
      const bonusStats = characters[character].bonusStats
      const personalBuffMap = { ...buffMap }

      // apply BonusStats to buffMap
      Object.keys(bonusStats).forEach((key) => {
        if (key in personalBuffMap) {
          const sharedKey = key as keyof BonusStats & BuffType
          personalBuffMap[sharedKey] += bonusStats[sharedKey]
        }
      })

      acc[character] = personalBuffMap
      return acc
    },
    {} as Record<string, BuffMap>,
  )

  return initialBuffMap
}

function prepareBuffs(
  characters: Record<string, Character>,
  allBuffs: BuffObject[],
) {
  const team = Object.keys(characters)

  const passiveBuffs = team.reduce(
    (acc, character) => {
      acc[character] = []
      return acc
    },
    {} as Record<string, ActiveBuffObject[]>,
  )
  const nonPassiveBuffs = [] as BuffObject[]

  allBuffs.forEach((buff) => {
    if (buff.duration < 999) {
      nonPassiveBuffs.push(buff)
    } else {
      passiveBuffs[buff.source].push({
        ...buff,
        endTime: 99999,
      })
    }
  })

  return { passiveBuffs, nonPassiveBuffs }
}

function getContext(
  characterData: Record<string, Character>,
  baseBuffMap: Record<string, BuffMap>,
  nonPassiveBuffs: BuffObject[],
): Context {
  const characters = structuredClone(characterData)
  const procc = { damage: 0, heal: 0, shield: 0 }
  console.log("nonPassiveBuffs", nonPassiveBuffs)

  return {
    activeBuffs: {},
    activeCharacter: "",
    allBuffs: nonPassiveBuffs,
    buffMap: baseBuffMap,
    buffDeferred: [],
    buffNext: [],
    characters,
    hasSwapped: false,
    prevChar: "",
    procc,
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

  // process character stats
  const initialBuffMap = getBuffMap(characters, baseBuffMap)

  // process passive Buffs
  const passiveBuffs = prepareBuffs(characters, buffData).passiveBuffs
  const nonPassiveBuffs = prepareBuffs(characters, buffData).nonPassiveBuffs

  // global mutable context
  const ctx: Context = getContext(characters, initialBuffMap, nonPassiveBuffs)

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
