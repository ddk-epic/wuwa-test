import { describe, expect, it } from "vitest"

import { CHARACTERS, ECHO, ECHO_SET, WEAPONS } from "@/definitions/constants"

import { cAbilities, cBuffs, characterTemplate } from "@/definitions/characters"
import { eBuffs, sBuffs } from "@/definitions/echoes"
import { wBuffs } from "@/definitions/weapons"

describe("Data integrity validation", () => {
  // count
  const characters = CHARACTERS.length
  const echoSets = ECHO_SET.length
  const echoes = ECHO.length
  const weapons = WEAPONS.length

  const abilities = Object.keys(cAbilities)

  const cData = Object.keys(characterTemplate)

  const buffs = {
    characters: Object.keys(cBuffs),
    echoes: Object.keys(eBuffs),
    echoSet: Object.keys(sBuffs),
    weapons: Object.keys(wBuffs),
  }

  it("Characters", () => {
    expect.soft(cData.length).toEqual(characters)
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
})
