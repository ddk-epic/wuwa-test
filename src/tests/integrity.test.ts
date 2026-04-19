import { describe, expect, it } from "vitest"

import { CHARACTERS, ECHO, ECHO_SET, WEAPONS } from "@/definitions/constants"

import {
  cAbilities,
  cBuffs,
  characterTemplate,
} from "@/content/registries/characters"
import { eBuffs, sBuffs } from "@/content/registries/echoes"
import { wBuffs } from "@/content/registries/weapons"

import buffHandler from "@/simulation/resolver"

describe("Data integrity validation", () => {
  // count
  const characters = CHARACTERS.length
  const echoSets = ECHO_SET.length
  const echoes = ECHO.length
  const weapons = WEAPONS.length

  const abilities = Object.keys(cAbilities)

  const characterData = Object.keys(characterTemplate)

  const buffs = {
    characters: Object.keys(cBuffs),
    echoes: Object.keys(eBuffs),
    echoSet: Object.keys(sBuffs),
    weapons: Object.keys(wBuffs),
  }

  const resolvers = Object.keys(buffHandler)

  it("Characters", () => {
    expect.soft(characterData.length).toEqual(characters)
  })

  it("Abilities", () => {
    expect.soft(abilities.length).toEqual(characters)
  })

  it("Buffs: characters", () => {
    expect.soft(buffs.characters.length).toEqual(characters)
  })
  it("Buffs: echoes", () => {
    expect.soft(buffs.echoes.length).toEqual(echoes)
  })
  it("Buffs: echo sets", () => {
    expect.soft(buffs.echoSet.length).toEqual(echoSets)
  })
  it("Buffs: weapons", () => {
    expect.soft(buffs.weapons.length).toEqual(weapons)
  })

  // it("Resolvers", () => {
  //   const all = characters + echoes + echoSets + weapons
  //   expect.soft(resolvers.length).toEqual(all)
  // })
})
