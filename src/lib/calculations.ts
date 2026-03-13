import type {
  ActiveBuffObject,
  BonusStats,
  BuffMap,
  BuffObject,
  BuffType,
  Character,
  Context,
  Result,
  Skill,
  TimelineItem,
} from "@/constants/types"

import { getBaseSkillName, roundBuffMapToPercentStrings } from "./utils"

import { hasSwapped, removeBuffByName } from "./helper"

import type { CHARACTER_KEY } from "@/constants/characters"
import { buffs } from "./effects/buffs"
import { echoBuffs } from "./effects/echo-buffs"
import { setBuffs } from "./effects/set-buffs"
import { weaponBuffs } from "./effects/weapon-buffs"

function removeExpiredBuffs(ctx: Context, action: TimelineItem) {
  const character = action.char
  const currentTime = ctx.time
  const buffsToRemove = new Set<ActiveBuffObject>()

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
      (b) => b.name === buff.name,
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

  const baseName = getBaseSkillName(action.skill.name)

  for (const buff of ctx.allBuffs) {
    const isAlreadyActive = ctx.activeBuffs[character].some(
      (b) => b.name === buff.name,
    )
    // check ownership
    if (buff.source !== character) continue

    // add buff triggered by Skill or Skill
    const hasNameMatch = buff.triggeredBy?.includes(baseName)
    const hasTriggerMatch = !!buff.triggeredBy?.includes(skill.category)

    if (!isAlreadyActive && (hasNameMatch || hasTriggerMatch)) {
      // handle end time
      const endTime =
        (currentTime + buff.duration * 60 - (skill.freezetime ?? 0)) / 60 // frame time
      const activeBuffObject = { ...buff, endTime }

      // handle damage procc

      if (buff.type === "Damage" && buff.consumedBy) {
        ctx.buffDeferred.push(activeBuffObject)
        // console.log(`add ${activeBuffObject.name} to buffDeferred`)
      }

      // handle outro
      if (buff.type === "BuffNext" && buff.appliesTo === "Next") {
        ctx.buffNext.push(activeBuffObject)
        // console.log(`add ${activeBuffObject.name} to buffNext`)
        continue
      }

      ctx.activeBuffs[character].push(activeBuffObject)
      // console.log(
      //   `add ${activeBuffObject.name} to activeBuffs[${activeCharacter}]`,
      // )
    }
  }
}

function handleEnergyShare(ctx: Context, value: number) {
  for (const character of Object.values(ctx.characters)) {
    const activeMultiplier = character.name === ctx.activeCharacter ? 1 : 0.5
    if (character) {
      character.dCond.Resonance += value * activeMultiplier
    }
  }
}

function evaluateDCond(ctx: Context, action: TimelineItem) {
  const character = ctx.characters[action.char]
  const skill = action.skill

  // handle resonance energy
  if (skill.classifications.includes("liberation")) {
    character.dCond.Resonance = 0
  }
  handleEnergyShare(ctx, skill.resonance)

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
  const buffs = ctx.activeBuffs[character]

  const baseName = getBaseSkillName(skill.name)

  if (buffs.length === 0) return

  for (const buff of buffs) {
    if (!buff) continue

    switch (buff.type) {
      case "BuffConsume":
        break

      case "Damage":
        for (const buff of [...ctx.buffDeferred]) {
          if (buff.consumedBy && buff.consumedBy.includes(baseName)) {
            const damageProcc: Skill = {
              name: `${buff.name} Procc`,
              category: skill.category,
              classifications: skill.classifications,
              mv: buff.value,
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
        }
        break

      default:
        for (const modifier of buff.modifier) {
          ctx.buffMap[character][modifier] += buff.value
          // console.log(
          //   `(${ctx.row}) buffMap[${buff.modifier}]: ${ctx.buffMap[character][modifier]}`,
          // )
        }
    }
  }
}

function processAction(
  ctx: Context,
  action: TimelineItem,
  initialBuffMap: Record<string, BuffMap>,
) {
  // update ctx
  ctx.activeCharacter =
    action.type === "parent" ? action.char : ctx.activeCharacter
  ctx.time = action.time
  ctx.buffMap = structuredClone(initialBuffMap)

  const character = action.char
  const skill = action.skill

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
    buffs: [...ctx.activeBuffs[character]],
    buffMap: buffMapValues,
  }

  // setup for next iteration
  ctx.prevChar = ctx.activeCharacter
  ctx.procc = { damage: 0, heal: 0, shield: 0 }
  ctx.row += 1
  return resultObject
}

function getBuffData(characters: Record<string, Character>) {
  const team = Object.keys(characters)

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
        const value = buff.value[Math.max(0, sequence - 1)]
        const returnObj = {
          ...buff,
          appliesTo: charName,
          source: charName,
          value,
        }
        return returnObj
      })
    })
    .flat()

  const setBuffData: BuffObject[] = team
    .map((charName) => {
      const echoSets = characters[charName].echoSet
      const getEchoBuffs = echoSets.flatMap((echoName) => {
        // if only 1 set, return 2pc and 5pc
        if (echoSets.length === 1) {
          return setBuffs[echoName]
        } else {
          // TODO: proper handling for 3pc
          return setBuffs[echoName][0]
        }
      })
      // console.log(echoBuffs)

      return getEchoBuffs.map((buff) => {
        const appliesTo = buff.appliesTo === "Self" ? charName : buff.appliesTo
        const buffObj = {
          ...buff,
          createdBy: [charName],
          appliesTo,
        }

        if ("source" in buff) {
          buffObj.source = charName
        }

        return buffObj
      })
    })
    .flat()

  const echoBuffData: BuffObject[] = team
    .map((charName) => {
      const echoName = characters[charName].echo
      return echoBuffs[echoName]
    })
    .flat()

  const allBuffs = [
    ...characterBuffData,
    ...weaponBuffData,
    ...setBuffData,
    ...echoBuffData,
  ]
  // console.log(allBuffs)

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

function preparePassiveBuffs(
  characters: Record<string, Character>,
  allBuffs: BuffObject[],
) {
  const team = Object.keys(characters)

  const allPassiveBuffs = Object.values(allBuffs)
    .flat()
    .filter((buff) => buff.duration === 99999)

  const activeBuffs: Record<string, ActiveBuffObject[]> = team.reduce(
    (acc, character) => {
      acc[character] = []
      return acc
    },
    {} as Record<string, ActiveBuffObject[]>,
  )

  allPassiveBuffs.forEach((buff) => {
    const activeBuff: ActiveBuffObject = { ...buff, endTime: 99999 }
    activeBuffs[buff.appliesTo].push(activeBuff)
  })

  return activeBuffs
}

function getContext(
  characterData: Record<string, Character>,
  baseBuffMap: Record<string, BuffMap>,
  allBuffs: BuffObject[],
  initialActiveBuffs: Record<string, ActiveBuffObject[]>,
): Context {
  const characters = structuredClone(characterData)
  const activeBuffs = structuredClone(initialActiveBuffs)
  const procc = { damage: 0, heal: 0, shield: 0 }

  return {
    activeBuffs,
    activeCharacter: "",
    allBuffs,
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
  const initialActiveBuffs = preparePassiveBuffs(characters, buffData)

  // global mutable context
  const ctx: Context = getContext(
    characters,
    initialBuffMap,
    buffData,
    initialActiveBuffs,
  )

  // calculation loop
  for (const action of actionList) {
    const result = processAction(ctx, action, initialBuffMap)
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
  preparePassiveBuffs,
  getContext,
  calculate,
}
