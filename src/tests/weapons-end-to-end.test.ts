import { describe, expect, it } from "vitest"

import { computeEventTimeline } from "@/lib/helper"
import { createTeam, skillOf } from "./helper"

import type { Action } from "@/shared/types"

import { simulate } from "@/simulation"

describe("weapons: end-to-end", () => {
  describe("sword: Blazing Brilliance", () => {
    const characters = createTeam(["sanhua", { weapon: "Blazing Brilliance" }])

    it("passive: test buff", () => {
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

      const buffsOnCast = result[0].buffs

      expect.soft(buffsOnCast).toContain("Blazing Brilliance (Atk)")
    })

    it("active: test buff", () => {
      const team = characters
      const skill = skillOf("sanhua").skill[1]
      const skill1 = skillOf("sanhua").basic[1]
      const skill2 = skillOf("sanhua").basic[2]
      const skill3 = skillOf("sanhua").basic[3]
      const skill4 = skillOf("sanhua").basic[4]
      const skill5 = skillOf("sanhua").basic[5]

      if (!(skill && skill1 && skill2 && skill3 && skill4 && skill5)) return

      const actionList: Action[] = [
        {
          characterId: "sanhua",
          skill: skill1,
          time: 0,
        },
        {
          characterId: "sanhua",
          skill: skill2,
          time: 60,
        },
        {
          characterId: "sanhua",
          skill: skill3,
          time: 120,
        },
        {
          characterId: "sanhua",
          skill: skill4,
          time: 180,
        },
        {
          characterId: "sanhua",
          skill: skill5,
          time: 240,
        },
        {
          characterId: "sanhua",
          skill: skill, // skill
          time: 300,
        },
        {
          characterId: "sanhua",
          skill: skill1,
          time: 360,
        },
        {
          characterId: "sanhua",
          skill: skill2,
          time: 420,
        },
        {
          characterId: "sanhua",
          skill: skill3,
          time: 480,
        },
        {
          characterId: "sanhua",
          skill: skill4,
          time: 540,
        },
        {
          characterId: "sanhua",
          skill: skill5,
          time: 600,
        },
      ]

      const eventTimeline = computeEventTimeline(actionList)
      const result = simulate(team, eventTimeline)

      const buffsOnFirstHit = result[1].buffs

      expect.soft(buffsOnFirstHit).toContain("Blazing Brilliance (Skill) x1")
      expect.soft(result[29].buffs).toContain("Blazing Brilliance (MAX)")

      /* unsolved side effect:
      Blazing Brilliance (Skill) x14 doesn't immediately 
      convert and waits for the next iteration */
    })
  })
  describe("sword: Emerald of Genesis", () => {
    const characters = createTeam(["sanhua", { weapon: "Emerald of Genesis" }])

    it("passive: test buff", () => {
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

      const buffsOnCast = result[0].buffs

      expect.soft(result[0].statMap.er).toBeGreaterThan(1.22)
      expect.soft(buffsOnCast).toContain("Emerald of Genesis (ER)")
    })

    it("active: test buff", () => {
      const team = characters
      const skill = skillOf("sanhua").skill[1]

      if (!skill) return

      const actionList: Action[] = [
        {
          characterId: "sanhua",
          skill,
          time: 0,
        },
        {
          characterId: "sanhua",
          skill,
          time: 30,
        },
      ]

      const eventTimeline = computeEventTimeline(actionList)
      const result = simulate(team, eventTimeline)

      const buffsOnFirstHit = result[1].buffs
      const buffsOnSecondHit = result[3].buffs

      expect.soft(buffsOnFirstHit).toContain("Emerald of Genesis (Atk) x1")
      expect.soft(buffsOnSecondHit).toContain("Emerald of Genesis (Atk) x2")
    })
  })
})
