import {
  ELEMENT,
  type ActiveBuffObject,
  type BUFF_TYPE,
  type BuffMap,
  type BuffObject,
  type Character,
  type Context,
  type ELEMENT_KEY,
  type Result,
  type Skill,
  type SKILL_CATEGORY_KEY,
  type TimelineItem,
} from "@/constants/types"

import { roundBuffMapToPercentStrings } from "./utils"

import { buffHandler, hasSwapped, isMatch, removeBuffByName } from "./helper"

import {
  BONUSSTAT_KEYS,
  type BONUSSTAT_KEY,
  type CHARACTER_KEY,
} from "@/constants/characters"
import { buffs } from "./effects/buffs"
import { echoBuffs } from "./effects/echo-buffs"
import { setBuffs } from "./effects/set-buffs"
import { weaponBuffs } from "./effects/weapon-buffs"

function removeExpiredBuffs(ctx: Context, action: TimelineItem) {
  const character = action.char
  const currentTime = ctx.time
  const buffsToRemove = new Set<ActiveBuffObject>()
  const buffs = ctx.activeBuffs[character]

  // filter by endtime
  for (const buff of buffs) {
    if (buff.endTime <= currentTime) {
      buffsToRemove.add(buff)
    }
  }

  // other filter rules

  // remove buffs
  ctx.activeBuffs[character] = buffs.filter((buff) => !buffsToRemove.has(buff))
}

function addOnSwapBuffs(ctx: Context, action: TimelineItem) {
  const character = action.char
  const currentTime = ctx.time
  const buffNext = ctx.buffNext

  if (!hasSwapped(ctx.prevChar, character) || buffNext.length === 0) return

  for (const buff of buffNext) {
    const isAlreadyActive = ctx.activeBuffs[character].some(
      (b) => b.id === buff.id,
    )
    if (isAlreadyActive) continue

    // add end time
    const endTime = currentTime + buff.duration
    const activeBuffObject = { ...buff, endTime }

    ctx.activeBuffs[character].push(activeBuffObject)
    // console.log(
    //   `add ${activeBuffObject.name} to activeBuffs[${character}]`,
    // )
  }
}

function addTriggeredBuffs(ctx: Context, action: TimelineItem) {
  const character = action.char
  const skill = action.skill
  const currentTime = ctx.time
  const buffs = ctx.activeBuffs[character]

  for (const buff of ctx.allBuffs) {
    //  preliminary checks
    if (buff.source !== character) continue

    const isAlreadyActive = buffs.some((b) => b.id === buff.id)
    if (isAlreadyActive) continue

    const sequenceRequirement = buff.sequenceReq ?? 0
    if (sequenceRequirement > ctx.characters[character].sequence) continue

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

    // handle damage procc
    if (buff.type === "Damage" && buff.consumedBy) {
      ctx.buffDeferred.push(activeBuffObject)
      // console.log(`add ${activeBuffObject.name} to buffDeferred`)
    }

    buffs.push(activeBuffObject)
    // console.log(
    //   `add ${activeBuffObject.name} to activeBuffs[${character}]`,
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
  const skill = action.skill
  const char = ctx.characters[characterId]
  const buffMap = ctx.buffMap[characterId]

  if (action.type === "parent") return 0

  function getBonus(
    classifications: (ELEMENT_KEY | SKILL_CATEGORY_KEY | "echo")[],
  ) {
    let result = 0

    for (const key of classifications) {
      const sharedKey = key as ELEMENT_KEY & SKILL_CATEGORY_KEY
      if (buffMap[sharedKey]) {
        result += buffMap[sharedKey]
      }
      console.log(`${ctx.row} buffMap[${sharedKey}]: ${buffMap[sharedKey]}`)
    }

    return result
  }

  // function getDeepen() {}

  // character
  const attack = char.atk * (1 + buffMap.atk) + char.bonusStats.atkFlat
  const skillMultiplier = action.skill.mv * (1 + buffMap.multiplier)
  const bonusMultiplier = 1 + getBonus(skill.classifications)
  const deepenMultiplier = 1
  const crit = Math.min(char.crit + buffMap.crit, 1)
  const critDmg = char.critDmg + buffMap.critDmg
  const critMultiplier = critDmg - crit + crit * critDmg

  // enemy
  const enemyDefense = 0.5
  const enemyResistance = 0.2
  const enemyResistances = 0.48 * (1 - enemyDefense + enemyResistance)

  const totalDamage =
    attack *
    skillMultiplier *
    bonusMultiplier *
    deepenMultiplier *
    critMultiplier *
    enemyResistances

  // console.log(
  //   "character",
  //   skill.name,
  //   attack,
  //   skillMultiplier,
  //   bonusMultiplier,
  //   totalDamage,
  // )
  // console.log("enemy", enemyResistances)

  return totalDamage
}

function evaluateBuffs(ctx: Context, action: TimelineItem) {
  const character = action.char
  const skill = action.skill
  const time = action.time
  const buffs = ctx.activeBuffs[character]

  for (const buff of buffs) {
    let currentModifiers = buff.modifiers

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

      case "Damage":
        for (const buff of [...ctx.buffDeferred]) {
          if (!(buff.consumedBy && buff.consumedBy.includes(skill.id))) break

          const damageProcc: Skill = {
            id: buff.id,
            name: `${buff.id} Procc`,
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
            time,
          }
          ctx.procc.damage = calculateDamage(ctx, damageAction)
          evaluateDCond(ctx, damageAction)
          removeBuffByName(ctx.activeBuffs[character], buff.id)
          removeBuffByName(ctx.buffDeferred, buff.id)
          // console.log(
          //   `${damageProcc.name} successfully procced for`,
          //   ctx.procc.damage,
          // )
        }
        break

      default:
        console.log(`(${ctx.row}) evaluateBuffs: default (${buff.name})`)
    }
    // switch end

    for (const modifier of currentModifiers) {
      const value = modifier.stackValue ? modifier.stackValue : modifier.value

      if (modifier.class !== "allEle") {
        ctx.buffMap[character][modifier.class] += value
      } else {
        for (const element of ELEMENT) {
          ctx.buffMap[character][element] += value
        }
        console.log(
          `(${ctx.row}) (${buff.name}) buffMap[${character}][${modifier.class}]: ${ctx.buffMap[character][modifier.class]} (+${value})`,
        )
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
  ctx.onFieldCharacter =
    action.type === "parent" ? action.char : ctx.onFieldCharacter
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

  const character = action.char
  const buffs = ctx.activeBuffs[character]
  const buffsPassive = passiveBuffs[character].map((buff) => buff.name)
  const buffsCharacter = buffs.map((buff) => buff.name)

  const roundedBuffMap: Record<keyof BuffMap, string> =
    roundBuffMapToPercentStrings(ctx.buffMap[character])
  const buffMapValues = Object.values(roundedBuffMap).slice(0, 32)

  const resultObject: Result = {
    row: ctx.row,
    char: character,
    type: action.type,
    skill: action.skill,
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
  ctx.prevChar = ctx.onFieldCharacter
  ctx.procc = { damage: 0, heal: 0, shield: 0 }
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
    .map((charName) => {
      const character = characters[charName]
      const sequence = character.sequence
      const getWeaponBuffs = weaponBuffs[character.weapon.name]

      // update WeaponBuffObject
      if (!getWeaponBuffs) return []

      return getWeaponBuffs.map((buff) => {
        const returnObj = {
          ...buff,
          duration: buff.duration * 60, // convert to frames
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
          duration: buff.duration * 60, // convert to frames
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
          duration: buff.duration * 60, // convert to frames
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

function getBuffMap(
  characters: Record<CHARACTER_KEY, Character>,
  buffMap: BuffMap,
  passiveBuffs: Record<CHARACTER_KEY, ActiveBuffObject[]>,
): Record<string, BuffMap> {
  const team = Object.keys(characters) as CHARACTER_KEY[]

  const initialBuffMap: Record<string, BuffMap> = team.reduce(
    (acc, character) => {
      const bonusStats = characters[character].bonusStats
      const personalBuffMap = { ...buffMap }

      // apply BonusStats
      BONUSSTAT_KEYS.forEach((key) => {
        if (key in personalBuffMap) {
          const sharedKey = key as BONUSSTAT_KEY & BUFF_TYPE
          personalBuffMap[sharedKey] += bonusStats[sharedKey]
        }
      })

      // apply passive buff stats
      passiveBuffs[character].forEach((buff) => {
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

      acc[character] = personalBuffMap
      return acc
    },
    {} as Record<string, BuffMap>,
  )

  return initialBuffMap
}

function getContext(
  characterData: Record<CHARACTER_KEY, Character>,
  baseBuffMap: Record<CHARACTER_KEY, BuffMap>,
  nonPassiveBuffs: BuffObject[],
) {
  const team = Object.keys(characterData) as CHARACTER_KEY[]
  const characters = structuredClone(characterData)
  const activeBuffs = team.reduce(
    (acc, character) => {
      acc[character] = []
      return acc
    },
    {} as Record<CHARACTER_KEY, ActiveBuffObject[]>,
  )
  const procc = { damage: 0, heal: 0, shield: 0 }

  return {
    activeBuffs,
    onFieldCharacter: "",
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
  } satisfies Context
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
  const ctx: Context = getContext(characters, initialBuffMap, nonPassiveBuffs)
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
