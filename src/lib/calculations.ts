import type {
  ActionList,
  ActionListItem,
  ActiveBuffObject,
  BuffMap,
  BuffObject,
  Context,
  Result,
  ResultList,
  Skill,
  Team,
} from "@/constants/types"

import team from "@/constants/characters"
import skills from "@/constants/skills"
import weapons from "@/constants/weapons"

import { buffs } from "./effects/buffs"

import { hasSwapped } from "./helper"

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
      console.log(
        `add ${activeBuffObject.name} to activeBuffs[${activeCharacter}]`,
      )
    }
  }
}

function addTriggeredBuffs(ctx: Context, skill: Skill) {
  const activeCharacter = ctx.activeCharacter
  const currentTime = ctx.time

  // triggered by Skill
  for (const buff of ctx.buffList) {
    const isAlreadyActive = ctx.activeBuffs[activeCharacter].some(
      (b) => b.name === buff.name,
    )
    const hasTrigger = buff.trigger.includes(skill.name)

    // add end time
    if (!isAlreadyActive && hasTrigger) {
      const endTime =
        (currentTime + buff.duration * 60 - (skill.freezetime ?? 0)) / 60 // frame time
      const activeBuffObject = { ...buff, endTime }

      if (buff.type === "BuffNext" && buff.appliesTo === "Next") {
        ctx.buffNext.push(activeBuffObject)
        console.log(`add ${activeBuffObject.name} to buffNext`)
      } else {
        ctx.activeBuffs[activeCharacter].push(activeBuffObject)
        console.log(
          `add ${activeBuffObject.name} to activeBuffs[${activeCharacter}]`,
        )
      }
    }
  }
}

function evaluateBuffs(ctx: Context) {
  const activeCharacter = ctx.activeCharacter
  const buffs = ctx.activeBuffs[activeCharacter]

  if (buffs.length === 0) {
    return
  }

  for (const buff of buffs) {
    if (buff.type.includes("Buff")) {
      ctx.buffMap[buff.target] += buff.value
    }
    console.log(
      `(${ctx.row}) ctx.buffMap[${buff.target}]: ${ctx.buffMap[buff.target]}`,
    )
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
  const char = team[ctx.activeCharacter]
  const weapon = weapons[char.weapon.name]
  const levelMultiplier = 12.5
  const enemyDefenseMultiplier = 0.52

  const attack =
    (char.attack + weapon.attack) *
      levelMultiplier *
      (1 + char.bonusStats.atk + ctx.buffMap.atk) +
    char.bonusStats.atkFlat +
    ctx.buffMap.atkFlat
  const damage = attack * skill.mv // * 1 + skillscaling bonus
  const crit = Math.min(char.crit + ctx.buffMap.crit, 1)
  const critDmg = char.critDmg + ctx.buffMap.critDmg
  const critMultiplier = critDmg - crit + crit * critDmg

  const totalDamage = damage * critMultiplier * enemyDefenseMultiplier
  // console.log(skill.name, attack, damage, totalDamage)
  return totalDamage
}

function processAction(
  ctx: Context,
  action: ActionListItem,
  buffMap: BuffMap,
) {
  // update ctx
  ctx.activeCharacter = action.char
  ctx.time = action.time

  const activeCharacter = ctx.activeCharacter
  const skill = action.skill

  // remove expired buffs
  removeExpiredBuffs(ctx)

  // add outro buffs
  addOnSwapBuffs(ctx)

  // add triggered buffs
  addTriggeredBuffs(ctx, skill)

  // evaluate buffs
  evaluateBuffs(ctx)

  // handle team buff

  // evaluate dynamic conditions (concerto, resonance)
  evaluateDCond(ctx, skill)
  const damage = calculateDamage(ctx, skill)

  const resultObject: Result = {
    row: ctx.row,
    char: ctx.activeCharacter,
    skill: skill,
    time: ctx.time,
    concerto: ctx.characters[ctx.activeCharacter].dCond.Concerto,
    resonance: ctx.characters[ctx.activeCharacter].dCond.Resonance,
    damage,
    buffs: [...ctx.activeBuffs[activeCharacter]],
  }

  // setup for next iteration
  ctx.buffMap = { ...buffMap }
  ctx.prevChar = ctx.activeCharacter
  ctx.row += 1
  return resultObject
}

function calculate(
  characters: Team,
  actionList: ActionList,
  buffmatrix: BuffMap,
): ResultList {
  const activeBuffRecord: Record<string, ActiveBuffObject[]> = Object.keys(
    characters,
  ).reduce(
    (acc, character) => {
      acc[character] = []
      return acc
    },
    {} as Record<string, ActiveBuffObject[]>,
  )
  const teamConfiguration = structuredClone(characters)
  const initialBuffMap = { ...buffmatrix }
  const initialBuffList: BuffObject[] = Object.keys(characters)
    .map((charName) => buffs[charName.toLowerCase()])
    .flat()
  // TODO: weapon + echo buffs
  const initialSkillList: Skill[] = Object.values(skills).flatMap((character) =>
    Object.values(character) // intro, outro, basic
      .flatMap((category) => Object.values(category)),
  )

  // global mutable context
  const ctx: Context = {
    activeBuffs: activeBuffRecord,
    activeCharacter: "",
    allSkills: initialSkillList,
    buffMap: initialBuffMap,
    buffList: initialBuffList,
    buffNext: [],
    characters: teamConfiguration,
    hasSwapped: false,
    prevChar: "",
    row: 1,
    time: 0,
  }

  const resultList: ResultList = []

  // calculation loop
  for (const action of actionList) {
    const result = processAction(ctx, action, initialBuffMap)
    resultList.push(result)
  }
  return resultList
}

export default calculate
