import { describe, expect, it } from "vitest"

import { computeEventTimeline } from "@/lib/helper"
import { createTeam, skillOf } from "./helper"

import type { Action } from "@/shared/types"

import { simulate } from "@/simulation"

describe("Characters: end-to-end", () => {
  describe("Encore", () => {
    const characters = createTeam("encore")
    it("Skill: test buffs", () => {
      const team = characters
      const skill = skillOf("encore").skill[1]

      if (!skill) return

      const actionList: Action[] = [
        {
          characterId: "encore",
          skill,
          time: 0,
        },
      ]

      const eventTimeline = computeEventTimeline(actionList)
      const result = simulate(team, eventTimeline)

      const totalDamage = result.reduce((total, row) => total + row.damage, 0)
      const buffsOnCast = result[0].buffs

      expect(totalDamage).toBeGreaterThan(0)
      expect.soft(buffsOnCast).toContain("Woolies Cheer Dance")
      expect.soft(result[1].buffs).toContain("Stringmaster (Atk) x1")
      expect.soft(result[2].buffs).toContain("Stringmaster (Atk) x2")
    })

    it("S1: test buffs", () => {
      const team = createTeam(["encore", { sequence: 1 }])

      const skill1 = skillOf("encore").basic[1]
      const skill2 = skillOf("encore").basic[2]
      const skill3 = skillOf("encore").basic[3]

      if (!(skill1 && skill2 && skill3)) return

      const actionList: Action[] = [
        {
          characterId: "encore",
          skill: skill1,
          time: 0,
        },
        {
          characterId: "encore",
          skill: skill2,
          time: 30,
        },
        {
          characterId: "encore",
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
      const team = createTeam(["encore", { sequence: 2 }])

      const skill1 = skillOf("encore").basic[1]
      const skill2 = skillOf("encore").basic[2]

      if (!(skill1 && skill2)) return

      const actionList: Action[] = [
        {
          characterId: "encore",
          skill: skill1,
          time: 0,
        },
        {
          characterId: "encore",
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
      const team = createTeam(["encore", { sequence: 3 }])

      const skill1 = skillOf("encore").forte[1]
      const skill2 = skillOf("encore").forte[2]

      if (!(skill1 && skill2)) return

      const actionList: Action[] = [
        {
          characterId: "encore",
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
      const team = createTeam(["encore", { sequence: 4 }])
      const skill1 = skillOf("encore").forte[2]

      if (!skill1) return

      const actionList: Action[] = [
        {
          characterId: "encore",
          skill: skill1,
          time: 0,
        },
      ]

      const eventTimeline = computeEventTimeline(actionList)
      const result = simulate(team, eventTimeline)

      const buffsGlobalOnCast = result[0].buffsGlobal
      const buffMapOnCast = result[0].statMap

      expect(buffsGlobalOnCast).toContain("Adventure? Let's go!")
      expect(buffMapOnCast.fusion).toBeCloseTo(1.02) // base is 82% fusion
      expect(buffMapOnCast.allEle).toBeCloseTo(0.12)
    })

    it("S5: test buffs", () => {
      const team = createTeam(["encore", { sequence: 5 }])
      const skill1 = skillOf("encore").basic[1]

      if (!skill1) return

      const actionList: Action[] = [
        {
          characterId: "encore",
          skill: skill1,
          time: 0,
        },
      ]

      const eventTimeline = computeEventTimeline(actionList)
      const result = simulate(team, eventTimeline)

      const buffsOnCast = result[0].buffs
      const buffMapOnCast = result[0].statMap

      expect.soft(buffsOnCast).toContain("Hero Takes the Stage!")
      expect(buffMapOnCast.skill).toBeCloseTo(0.35)
    })

    it("S6: test buffs", () => {
      const team = createTeam(["encore", { sequence: 6 }])
      const skill1 = skillOf("encore").liberation[1]
      const skill2 = skillOf("encore").basic[6]
      const skill3 = skillOf("encore").basic[7]

      if (!(skill1 && skill2 && skill3)) return

      const actionList: Action[] = [
        {
          characterId: "encore",
          skill: skill1,
          time: 0,
        },
        {
          characterId: "encore",
          skill: skill2,
          time: 30,
        },
        {
          characterId: "encore",
          skill: skill3,
          time: 60,
        },
      ]

      const eventTimeline = computeEventTimeline(actionList)
      const result = simulate(team, eventTimeline)

      const buffsOnCast = result[0].buffs

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
    const characters = createTeam("sanhua")

    it("Basic: test damage", () => {
      const team = characters
      const skill = skillOf("sanhua").basic[1]

      if (!skill) return

      const actionList: Action[] = [
        {
          characterId: "sanhua",
          skill,
          time: 0,
        },
      ]

      const eventTimeline = computeEventTimeline(actionList)
      const result = simulate(team, eventTimeline)

      const totalDamage = result.reduce((total, row) => total + row.damage, 0)
      const buffsOnCast = result[0].buffs

      expect(totalDamage).toBeGreaterThan(0)
      expect.soft(buffsOnCast).toContain("Moonlit Clouds 2pc")
    })

    it("Inherent 1: test buffs", () => {
      const team = characters
      const skill1 = skillOf("sanhua").intro[1]

      if (!skill1) return

      const actionList: Action[] = [
        {
          characterId: "sanhua",
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
      const skill1 = skillOf("sanhua").basic[5]
      const skill2 = skillOf("sanhua").forte[1]

      if (!(skill1 && skill2)) return

      const actionList: Action[] = [
        {
          characterId: "sanhua",
          skill: skill1,
          time: 0,
        },
        {
          characterId: "sanhua",
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
      const team = createTeam(["sanhua", { sequence: 1 }])
      const skill1 = skillOf("sanhua").basic[5]

      if (!skill1) return

      const actionList: Action[] = [
        {
          characterId: "sanhua",
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
      const team = createTeam(["sanhua", { sequence: 4 }])
      const skill1 = skillOf("sanhua").liberation[1]
      const skill2 = skillOf("sanhua").forte[1]

      if (!(skill1 && skill2)) return

      const actionList: Action[] = [
        {
          characterId: "sanhua",
          skill: skill1,
          time: 0,
        },
        {
          characterId: "sanhua",
          skill: skill2,
          time: 30,
        },
      ]

      const eventTimeline = computeEventTimeline(actionList)
      const result = simulate(team, eventTimeline)

      const buffsOnCast = result[0].buffs
      const buffsFirstHit = result[1].buffs
      const buffMapDetonateHit = result[3].statMap

      expect(buffsOnCast).toContain("Blade Mastery")
      expect(buffsOnCast).toContain("Blade Mastery (energy)")
      expect(buffsFirstHit).toContain("Ice Glacier")
      expect(buffMapDetonateHit.bonus).toBeCloseTo(1.2)
    })

    it("S5: test buffs", () => {
      const team = createTeam(["sanhua", { sequence: 5 }])
      const skill1 = skillOf("sanhua").forte[1]

      if (!skill1) return

      const actionList: Action[] = [
        {
          characterId: "sanhua",
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
      const team = createTeam(["sanhua", { sequence: 6 }])
      const skill1 = skillOf("sanhua").skill[1]
      const skill2 = skillOf("sanhua").liberation[1]
      const skill3 = skillOf("sanhua").forte[1]

      if (!(skill1 && skill2 && skill3)) return

      const actionList: Action[] = [
        {
          characterId: "sanhua",
          skill: skill1,
          time: 0,
        },
        {
          characterId: "sanhua",
          skill: skill2,
          time: 30,
        },
        {
          characterId: "sanhua",
          skill: skill3,
          time: 60,
        },
      ]

      // ============
      // type    idx
      // cast(1)  0
      // hit      1
      // cast(2)  2
      // hit      3
      // cast(3)  4
      // hit      5 <-
      // hit      6 <-
      // ============

      const eventTimeline = computeEventTimeline(actionList)
      const result = simulate(team, eventTimeline)

      expect(result[5].buffsGlobal).toContain("Daybreak Radiance x2")
      expect(result[6].buffsGlobal).toContain("Daybreak Radiance x2")
    })
  })
})
