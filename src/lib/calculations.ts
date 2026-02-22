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
import weapons from "@/constants/weapons"

import { buffs } from "./effects/buffs"

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
  console.log(skill.name, attack, damage, totalDamage)
  return totalDamage
}

function processAction(ctx: Context, action: ActionListItem) {
  // update ctx
  ctx.activeCharacter = action.char
  ctx.time = action.time

  const character = ctx.characters[action.char]
  const skill = action.skill

  // check swaps
  // ctx.hasSwapped = hasSwapped(ctx.prevChar, ctx.activeCharacter)

  // remove expired buffs
  // removeExpiredBuffs(ctx)

  // check if condition is met to be added to activeBuffs

  // go over buffList, check by procced

  // calculate end time
  // if (buff) {
  //   const currentTime = entry.time
  //   const endTime =
  //     (currentTime + buff.duration * 60 - (entry.action.freezetime ?? 0)) / 60
  //   const activeBuffObject = { ...buff, endTime }

  //   activeBuffs.push(activeBuffObject)
  // }

  // de-dupe
  // ctx.activeBuffs = Array.from(
  //   new Map(ctx.activeBuffs.map((buff) => [buff.name, buff])).values(),
  // )

  // evaluate and apply buffs
  for (const buff of ctx.activeBuffs) {
    if (buff) {
    }
  }

  // handle team buff

  // evaluate dynamic conditions (concerto, resonance)
  evaluateDCond(ctx, skill)
  const damage = calculateDamage(ctx, skill)

  const resultObject: Result = {
    char: ctx.activeCharacter,
    skill: skill,
    time: ctx.time,
    concerto: ctx.characters[ctx.activeCharacter].dCond.Concerto,
    resonance: ctx.characters[ctx.activeCharacter].dCond.Resonance,
    damage,
    buffs: ctx.activeBuffs,
  }

  // setup for next iteration
  ctx.prevChar = ctx.activeCharacter
  return resultObject
}

function calculate(
  characters: Team,
  actionList: ActionList,
  buffmatrix: BuffMap,
): ResultList {
  const teamConfig = structuredClone(characters)
  const initializedBuffMap = structuredClone(buffmatrix)
  const buffList: BuffObject[] = Object.keys(characters)
    .map((charName) => buffs[charName.toLowerCase()])
    .flat()

  // TODO: weapon + echo buffs

  // global mutable context
  const ctx: Context = {
    activeBuffs: [] as ActiveBuffObject[],
    activeCharacter: "",
    buffMap: initializedBuffMap,
    characters: teamConfig,
    hasSwapped: false,
    prevChar: "",
    time: 0,
  }

  const resultList: ResultList = []

  // calculation loop
  for (const action of actionList) {
    const result = processAction(ctx, action)
    resultList.push(result)
  }
  return resultList
}

export default calculate
