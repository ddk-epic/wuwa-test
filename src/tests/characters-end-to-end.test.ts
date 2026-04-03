import { describe, expect, it } from "vitest"

import { computeBaseCharacter, computeEventTimeline } from "@/lib/helper"

import type { ActionListItem, Character, CharSettings } from "@/shared/types"

import characterTemplate from "@/definitions/characters"
import { skillData } from "@/definitions/abilities"

import { simulate } from "@/simulation"

describe("Characters: end-to-end", () => {
  describe("Encore", () => {
    const characterId = "encore"
    const template = characterTemplate[characterId]
    const characterSettings = {
      sequence: 0,
      weapon: template.weapon,
      echoSet: template.echoSet,
      echo: template.echo,
    } satisfies CharSettings
    const characters: Character[] = [
      computeBaseCharacter(characterId, characterSettings),
    ]
    const skills = skillData[characterId]

    const onCast = 0

    it("Basic: default test", () => {
      const team = characters
      const skill = skills.basic[1]

      if (!skill) return

      const actionList: ActionListItem[] = [
        {
          characterId,
          skill,
          time: 0,
        },
      ]

      const eventTimeline = computeEventTimeline(actionList)
      const result = simulate(team, eventTimeline)

      const totalDamage = result.reduce((total, row) => total + row.damage, 0)
      const buffsOnCast = result[onCast].buffs

      expect(totalDamage).toBeGreaterThan(0)
      expect.soft(result[onCast].statMap.atk).toBeGreaterThan(0.6)
      expect.soft(buffsOnCast).toContain("Stringmaster (Ele)")
      expect.soft(buffsOnCast).toContain("Molten Rift 2pc")
    })

    it("Skill: test buffs", () => {
      const team = characters
      const skill = skills.skill[1]

      if (!skill) return

      const actionList: ActionListItem[] = [
        {
          characterId,
          skill,
          time: 0,
        },
      ]

      const eventTimeline = computeEventTimeline(actionList)
      const result = simulate(team, eventTimeline)

      const totalDamage = result.reduce((total, row) => total + row.damage, 0)
      const buffsOnCast = result[onCast].buffs
      const buffsFirstHit = result[1].buffs
      const buffsSecondHit = result[2].buffs

      expect(totalDamage).toBeGreaterThan(0)
      expect.soft(buffsOnCast).toContain("Molten Rift 2pc")
      expect.soft(buffsOnCast).toContain("Molten Rift 5pc")
      expect.soft(buffsOnCast).toContain("Woolies Cheer Dance")
      expect.soft(buffsFirstHit).toContain("Stringmaster (ATK) x1")
      expect.soft(buffsSecondHit).toContain("Stringmaster (ATK) x2")
    })

    it("S1: test buffs", () => {
      const sequence = 1
      const team: Character[] = [{ ...characters[0], sequence }]

      const skill1 = skills.basic[1]
      const skill2 = skills.basic[2]
      const skill3 = skills.basic[3]

      if (!(skill1 && skill2 && skill3)) return

      const actionList: ActionListItem[] = [
        {
          characterId,
          skill: skill1,
          time: 0,
        },
        {
          characterId,
          skill: skill2,
          time: 30,
        },
        {
          characterId,
          skill: skill3,
          time: 60,
        },
      ]

      const eventTimeline = computeEventTimeline(actionList)
      const result = simulate(team, eventTimeline)

      const totalDamage = result.reduce((total, row) => total + row.damage, 0)

      // ============
      // type    idx
      // cast(1)  0
      // hit      1 <-
      // cast(2)  2
      // hit      3 <-
      // cast(3)  4
      // hit      5 <-
      // hit      6 <-
      // ============

      expect(totalDamage).toBeGreaterThan(0)
      expect.soft(result[1].buffs).toContain("Wooly's Fairy Tale x1")
      expect.soft(result[3].buffs).toContain("Wooly's Fairy Tale x2")
      expect.soft(result[5].buffs).toContain("Wooly's Fairy Tale x3")
      expect.soft(result[6].buffs).toContain("Wooly's Fairy Tale x4")
    })

    it("S2: test buffs", () => {
      const sequence = 2
      const team: Character[] = [{ ...characters[0], sequence }]

      const skill1 = skills.basic[1]
      const skill2 = skills.basic[2]

      if (!(skill1 && skill2)) return

      const actionList: ActionListItem[] = [
        {
          characterId,
          skill: skill1,
          time: 0,
        },
        {
          characterId,
          skill: skill2,
          time: 30,
        },
      ]

      const eventTimeline = computeEventTimeline(actionList)
      const result = simulate(team, eventTimeline)

      const buffsFirstHit = result[1].buffs
      const buffsSecondHit = result[3].buffs

      expect.soft(buffsFirstHit).toContain("Sheep-counting Lullaby")
      expect.soft(buffsSecondHit).not.toContain("Sheep-counting Lullaby")
    })

    it("S3: test buffs", () => {
      const sequence = 3
      const team: Character[] = [{ ...characters[0], sequence }]

      const skill1 = skills.forte[1]
      const skill2 = skills.forte[2]

      if (!(skill1 && skill2)) return

      const actionList: ActionListItem[] = [
        {
          characterId,
          skill: skill1,
          time: 0,
        },
      ]

      const eventTimeline = computeEventTimeline(actionList)
      const result = simulate(team, eventTimeline)

      const buffMapOnHit = result[1].statMap

      expect(buffMapOnHit.multiplier).toBeCloseTo(0.4)
    })

    it("S4: test buffs", () => {
      const sequence = 4
      const team: Character[] = [{ ...characters[0], sequence }]
      const skill1 = skills.forte[2]

      if (!skill1) return

      const actionList: ActionListItem[] = [
        {
          characterId,
          skill: skill1,
          time: 0,
        },
      ]

      const eventTimeline = computeEventTimeline(actionList)
      const result = simulate(team, eventTimeline)

      const buffsGlobalOnCast = result[onCast].buffsGlobal
      const buffMapOnCast = result[onCast].statMap

      expect(buffsGlobalOnCast).toContain("Adventure? Let's go!")
      expect(buffMapOnCast.fusion).toBeGreaterThan(1.1) // base is 94% fusion
    })

    it("S5: test buffs", () => {
      const sequence = 5
      const team: Character[] = [{ ...characters[0], sequence }]
      const skill1 = skills.basic[1]

      if (!skill1) return

      const actionList: ActionListItem[] = [
        {
          characterId,
          skill: skill1,
          time: 0,
        },
      ]

      const eventTimeline = computeEventTimeline(actionList)
      const result = simulate(team, eventTimeline)

      const buffsOnCast = result[onCast].buffs
      const buffMapOnCast = result[onCast].statMap

      expect.soft(buffsOnCast).toContain("Hero Takes the Stage!")
      expect(buffMapOnCast.skill).toBeCloseTo(0.35)
    })

    it("S6: test buffs", () => {
      const sequence = 6
      const team: Character[] = [{ ...characters[0], sequence }]
      const skill1 = skills.liberation[1]
      const skill2 = skills.basic[6]
      const skill3 = skills.basic[7]

      if (!(skill1 && skill2 && skill3)) return

      const actionList: ActionListItem[] = [
        {
          characterId,
          skill: skill1,
          time: 0,
        },
        {
          characterId,
          skill: skill2,
          time: 30,
        },
        {
          characterId,
          skill: skill3,
          time: 60,
        },
      ]

      const eventTimeline = computeEventTimeline(actionList)
      const result = simulate(team, eventTimeline)

      const buffsOnCast = result[onCast].buffs

      // ============
      // type    idx
      // cast(1)  0
      // cast(2)  1
      // hit      2 <-
      // hit      3 <-
      // cast(3)  4
      // hit      5 <-
      // hit      6 <-
      // hit      7 <-
      // ============

      expect(buffsOnCast).toContain("Cosmos Rave") // Liberation
      expect(buffsOnCast).toContain("Angry Cosmos")

      expect.soft(result[2].buffs).toContain("Woolies Save the World! x1")
      expect.soft(result[3].buffs).toContain("Woolies Save the World! x2")
      expect.soft(result[5].buffs).toContain("Woolies Save the World! x3")
      expect.soft(result[6].buffs).toContain("Woolies Save the World! x4")
      expect.soft(result[7].buffs).toContain("Woolies Save the World! x5")

      expect(result[7].statMap.atk).toBeGreaterThan(0.8) // at max stacks: +25% atk
    })
  })

  describe("Sanhua", () => {
    const characterId = "sanhua"
    const template = characterTemplate[characterId]
    const characterSettings = {
      sequence: 0,
      weapon: template.weapon,
      echoSet: template.echoSet,
      echo: template.echo,
    } satisfies CharSettings
    const characters: Character[] = [
      computeBaseCharacter(characterId, characterSettings),
    ]
    const skills = skillData[characterId]

    const onCast = 0

    it("Basic: test damage", () => {
      const team = characters
      const skill = skills.basic[1]

      if (!skill) return

      const actionList: ActionListItem[] = [
        {
          characterId,
          skill,
          time: 0,
        },
      ]

      const eventTimeline = computeEventTimeline(actionList)
      const result = simulate(team, eventTimeline)

      const totalDamage = result.reduce((total, row) => total + row.damage, 0)
      const buffsOnCast = result[onCast].buffs

      expect(totalDamage).toBeGreaterThan(0)
      expect.soft(buffsOnCast).toContain("Moonlit Clouds 2pc")
    })

    it("Inherent 1: test buffs", () => {
      const team = characters
      const skill1 = skills.intro[1]

      if (!skill1) return

      const actionList: ActionListItem[] = [
        {
          characterId,
          skill: skill1,
          time: 0,
        },
      ]

      const eventTimeline = computeEventTimeline(actionList)
      const result = simulate(team, eventTimeline)

      const buffsFirstHit = result[1].buffs
      const buffMapFirstHit = result[1].statMap

      expect(buffsFirstHit).toContain("Ice Thorn")
      expect(buffsFirstHit).toContain("Condensation")
      expect(buffMapFirstHit.skill).toBeGreaterThan(0.2)
    })

    it("Inherent 2: test buffs", () => {
      const team = characters
      const skill1 = skills.basic[5]
      const skill2 = skills.forte[1]

      if (!(skill1 && skill2)) return

      const actionList: ActionListItem[] = [
        {
          characterId,
          skill: skill1,
          time: 0,
        },
        {
          characterId,
          skill: skill2,
          time: 30,
        },
      ]

      const eventTimeline = computeEventTimeline(actionList)
      const result = simulate(team, eventTimeline)

      const buffsFirstHit = result[1].buffs
      const buffMapDetonateHit = result[3].statMap

      expect(buffsFirstHit).toContain("Avalanche")
      expect(buffMapDetonateHit.bonus).toBeCloseTo(0.2)
    })

    it("S1: test buffs", () => {
      const sequence = 1
      const team: Character[] = [{ ...characters[0], sequence }]
      const skill1 = skills.basic[5]

      if (!skill1) return

      const actionList: ActionListItem[] = [
        {
          characterId,
          skill: skill1,
          time: 0,
        },
      ]

      const eventTimeline = computeEventTimeline(actionList)
      const result = simulate(team, eventTimeline)

      const buffsFirstHit = result[1].buffs
      const buffMapFirstHit = result[1].statMap

      expect(buffsFirstHit).toContain("Solitude's Embrace")
      expect(buffMapFirstHit.crit).toBeGreaterThan(0.8) // base is 67% + 15% fusion
    })

    it("S4: test buffs", () => {
      const sequence = 4
      const team: Character[] = [{ ...characters[0], sequence }]
      const skill1 = skills.liberation[1]
      const skill2 = skills.forte[1]

      if (!(skill1 && skill2)) return

      const actionList: ActionListItem[] = [
        {
          characterId,
          skill: skill1,
          time: 0,
        },
        {
          characterId,
          skill: skill2,
          time: 30,
        },
      ]

      const eventTimeline = computeEventTimeline(actionList)
      const result = simulate(team, eventTimeline)

      const buffsOnCast = result[onCast].buffs
      const buffsFirstHit = result[1].buffs
      const buffMapDetonateHit = result[3].statMap

      expect(buffsOnCast).toContain("Blade Mastery")
      expect(buffsOnCast).toContain("Blade Mastery (energy)")
      expect(buffsFirstHit).toContain("Ice Glacier")
      expect(buffMapDetonateHit.bonus).toBeCloseTo(1.2)
    })

    it("S5: test buffs", () => {
      const sequence = 5
      const team: Character[] = [{ ...characters[0], sequence }]
      const skill1 = skills.forte[1]

      if (!skill1) return

      const actionList: ActionListItem[] = [
        {
          characterId,
          skill: skill1,
          time: 0,
        },
      ]

      const eventTimeline = computeEventTimeline(actionList)
      const result = simulate(team, eventTimeline)

      const buffMapFirstHit = result[1].statMap
      const buffMapSecondHit = result[2].statMap

      expect(buffMapFirstHit.critDmg).toBeGreaterThan(3.5)
      expect(buffMapSecondHit.critDmg).toBeGreaterThan(3.5)
    })

    it("S6: test buffs", () => {
      const sequence = 6
      const team: Character[] = [{ ...characters[0], sequence }]
      const skill1 = skills.forte[1]

      if (!skill1) return

      const actionList: ActionListItem[] = [
        {
          characterId,
          skill: skill1,
          time: 0,
        },
      ]

      const eventTimeline = computeEventTimeline(actionList)
      const result = simulate(team, eventTimeline)

      const buffsGlobalFirstHit = result[1].buffsGlobal
      const buffsGlobalSecondHit = result[2].buffsGlobal

      expect(buffsGlobalFirstHit).toContain("Daybreak Radiance x1")
      expect(buffsGlobalSecondHit).toContain("Daybreak Radiance x2") // TODO: correct procc req
    })
  })
})
