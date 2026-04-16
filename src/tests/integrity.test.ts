import { describe, expect, it } from "vitest"

import { CHARACTERS, ECHO, ECHO_SET, WEAPONS } from "@/definitions/constants"
import skillData from "@/definitions/abilities"

import characterTemplate from "@/definitions/characters"

import { buffs as characterBuffs } from "@/definitions/buffs/characters"
import setBuffs from "@/definitions/buffs/echo-set"
import echoBuffs from "@/definitions/buffs/echoes"
import weaponBuffs from "@/definitions/buffs/weapon"

import buffHandler from "@/simulation/resolver"

describe("Data integrity validation", () => {
  // count
  const characters = CHARACTERS.length
  const echoSets = ECHO_SET.length
  const echoes = ECHO.length
  const weapons = WEAPONS.length

  const abilities = Object.keys(skillData)

  const characterData = Object.keys(characterTemplate)

  const buffs = {
    characters: Object.keys(characterBuffs),
    echoes: Object.keys(echoBuffs),
    echoSet: Object.keys(setBuffs),
    weapons: Object.keys(weaponBuffs),
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
