import type {
  ActionList,
  ActionListItem,
  ActiveBuffObject,
  BonusStats,
  BuffMap,
  BuffObject,
  BuffType,
  Character,
  Context,
  Result,
  ResultList,
  Skill,
} from "@/constants/types"

import team from "@/constants/characters"
import skills from "@/constants/skills"
import weapons from "@/constants/weapons"

import { buffs } from "./effects/buffs"

import { hasSwapped, removeBuffByName } from "./helper"
import { weaponBuffs } from "./effects/weapon-buffs"
import { echoBuffs } from "./effects/echo-buffs"

function removeExpiredBuffs(ctx: Context) {
  const activeCharacter = ctx.activeCharacter
  const currentTime = ctx.time
  const buffsToRemove = new Set<ActiveBuffObject>()

  // filter by endtime
  for (const buff of ctx.activeBuffs[ctx.activeCharacter]) {
    if (buff.endTime * 60 <= currentTime) {
      // frame time
      buffsToRemove.add(buff)
    }
  }

  // other filter rules

  // remove buffs
  ctx.activeBuffs[activeCharacter] = ctx.activeBuffs[activeCharacter].filter(
    (buff) => !buffsToRemove.has(buff),
  )
}

function addOnSwapBuffs(ctx: Context) {
  const activeCharacter = ctx.activeCharacter
  const currentTime = ctx.time
  const buffs = ctx.buffNext

  if (!hasSwapped(ctx.prevChar, activeCharacter) || buffs.length === 0) return

  for (const buff of buffs) {
    const isAlreadyActive = ctx.activeBuffs[activeCharacter].some(
      (b) => b.name === buff.name,
    )

    // add end time
    if (!isAlreadyActive) {
      const endTime = (currentTime + buff.duration * 60) / 60 // frame time
      const activeBuffObject = { ...buff, endTime }

      ctx.activeBuffs[activeCharacter].push(activeBuffObject)
      // console.log(
      //   `add ${activeBuffObject.name} to activeBuffs[${activeCharacter}]`,
      // )
    }
  }
}

function addTriggeredBuffs(ctx: Context, skill: Skill) {
  const activeCharacter = ctx.activeCharacter
  const currentTime = ctx.time

  // add buff triggered by Skill
  for (const buff of ctx.allBuffs) {
    const isAlreadyActive = ctx.activeBuffs[activeCharacter].some(
      (b) => b.name === buff.name,
    )
    const hasTrigger = buff.createdBy.includes(skill.name)

    if (!isAlreadyActive && hasTrigger) {
      // handle end time
      const endTime =
        (currentTime + buff.duration * 60 - (skill.freezetime ?? 0)) / 60 // frame time
      const activeBuffObject = { ...buff, endTime }

      // handle damage procc

      if (buff.type === "Damage" && buff.consumedBy) {
        if (buff.consumedBy) {
          ctx.buffDeferred.push(activeBuffObject)
          // console.log(`add ${activeBuffObject.name} to buffDeferred`)
        }
      }

      // handle outro
      if (buff.type === "BuffNext" && buff.appliesTo === "Next") {
        ctx.buffNext.push(activeBuffObject)
        // console.log(`add ${activeBuffObject.name} to buffNext`)
      } else {
        ctx.activeBuffs[activeCharacter].push(activeBuffObject)
        // console.log(
        //   `add ${activeBuffObject.name} to activeBuffs[${activeCharacter}]`,
        // )
      }
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

function evaluateDCond(ctx: Context, skill: Skill) {
  const character = ctx.characters[ctx.activeCharacter]

  // handle resonance energy
  if (skill.classifications.includes("liberation")) {
    character.dCond.Resonance = 0
  }
  handleEnergyShare(ctx, skill.resonance)

  // handle concerto
  character.dCond.Concerto += skill.concerto
}

function calculateDamage(ctx: Context, skill: Skill) {
  const activeCharacter = ctx.activeCharacter
  const char = team[activeCharacter]
  const weapon = weapons[char.weapon.name]
  const levelMultiplier = 12.5
  const enemyDefenseMultiplier = 0.52

  const attack =
    (char.atk + weapon.atk) *
      levelMultiplier *
      (1 + char.bonusStats.atk + ctx.buffMap[activeCharacter].atk) +
    char.bonusStats.atkFlat
  const damage =
    attack * skill.mv * (1 + ctx.buffMap[activeCharacter].multiplier)
  const crit = Math.min(char.crit + ctx.buffMap[activeCharacter].crit, 1)
  const critDmg = char.critDmg + ctx.buffMap[activeCharacter].critDmg
  const critMultiplier = critDmg - crit + crit * critDmg

  const totalDamage = damage * critMultiplier * enemyDefenseMultiplier
  // console.log(skill.name, attack, damage, totalDamage)
  return totalDamage
}

function evaluateBuffs(ctx: Context, skill: Skill) {
  const activeCharacter = ctx.activeCharacter
  const buffs = ctx.activeBuffs[activeCharacter]

  if (buffs.length === 0) return

  for (const buff of buffs) {
    if (!buff) continue

    switch (buff.type) {
      case "BuffConsume":
        break

      case "Damage":
        for (const buff of [...ctx.buffDeferred]) {
          if (buff.consumedBy && buff.consumedBy.includes(skill.name)) {
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
            ctx.procc.damage = calculateDamage(ctx, damageProcc)
            evaluateDCond(ctx, damageProcc)
            removeBuffByName(ctx.activeBuffs[activeCharacter], buff.name)
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
          ctx.buffMap[activeCharacter][modifier] += buff.value
          // console.log(
          //   `(${ctx.row}) buffMap[${buff.modifier}]: ${ctx.buffMap[activeCharacter][modifier]}`,
          // )
        }
    }
  }
}

function processAction(
  ctx: Context,
  action: ActionListItem,
  initialBuffMap: Record<string, BuffMap>,
) {
  // update ctx
  ctx.activeCharacter = action.char
  ctx.time = action.time
  ctx.buffMap = structuredClone(initialBuffMap)

  const activeCharacter = ctx.activeCharacter
  const skill = action.skill

  // remove expired buffs
  removeExpiredBuffs(ctx)

  // add outro buffs
  addOnSwapBuffs(ctx)

  // add triggered buffs
  addTriggeredBuffs(ctx, skill)

  // evaluate buffs
  evaluateBuffs(ctx, skill)

  // handle team buff

  // evaluate dynamic conditions (concerto, resonance)
  evaluateDCond(ctx, skill)
  const damage = calculateDamage(ctx, skill)

  const buffMapValues = Object.values(ctx.buffMap[activeCharacter]).slice(0, 32)

  const resultObject: Result = {
    row: ctx.row,
    char: ctx.activeCharacter,
    skill: skill,
    time: ctx.time,
    concerto: ctx.characters[ctx.activeCharacter].dCond.Concerto,
    resonance: ctx.characters[ctx.activeCharacter].dCond.Resonance,
    damage,
    procc: { ...ctx.procc },
    buffs: [...ctx.activeBuffs[activeCharacter]],
    buffMap: buffMapValues,
  }

  // setup for next iteration
  ctx.prevChar = ctx.activeCharacter
  ctx.procc = { damage: 0, heal: 0, shield: 0 }
  ctx.row += 1
  return resultObject
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

function getContext(
  characterData: Record<string, Character>,
  buffmatrix: Record<string, BuffMap>,
): Context {
  const characters = structuredClone(characterData)
  const team = Object.keys(characters)

  const activeBuffs: Record<string, ActiveBuffObject[]> = team.reduce(
    (acc, character) => {
      acc[character] = []
      return acc
    },
    {} as Record<string, ActiveBuffObject[]>,
  )

  const characterSkills: Skill[] = Object.values(skills).flatMap((character) =>
    Object.values(character) // intro, outro, basic
      .flatMap((category) => Object.values(category)),
  )
  // TODO: echo skills
  const skillList = [...characterSkills]

  const characterBuffData: BuffObject[] = team
    .map((charName) => buffs[charName])
    .flat()

  const weaponBuffData: BuffObject[] = team
    .map((charName) => {
      const sequence = characters[charName].sequence
      const getWeaponBuffs = weaponBuffs[characters[charName].weapon.name]

      // update WeaponBuffObject
      if (!getWeaponBuffs) return []

      return getWeaponBuffs.map((buff) => {
        const value = buff.value[Math.max(0, sequence - 1)]
        return { ...buff, appliesTo: charName, owner: charName, value }
      })
    })
    .flat()

  const echoBuffData: BuffObject[] = team
    .map((charName) => {
      const echoName = characters[charName].echo
      return echoBuffs[echoName]
    })
    .flat()

  const allBuffs = [...characterBuffData, ...weaponBuffData, ...echoBuffData]
  // console.log(buffList)

  const procc = {
    damage: 0,
    heal: 0,
    shield: 0,
  }

  return {
    activeBuffs,
    activeCharacter: "",
    allBuffs,
    allSkills: skillList,
    buffMap: buffmatrix,
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
  characters: Record<string, Character>,
  actionList: ActionList,
  baseBuffMap: BuffMap,
): ResultList {
  const resultList: ResultList = []

  // process passive Buffs
  const initialBuffMap = getBuffMap(characters, baseBuffMap)

  // global mutable context
  const ctx: Context = getContext(characters, initialBuffMap)

  // calculation loop
  for (const action of actionList) {
    const result = processAction(ctx, action, initialBuffMap)
    resultList.push(result)
  }
  return resultList
}

export default calculate
