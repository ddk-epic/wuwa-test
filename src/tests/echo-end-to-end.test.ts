import { describe, expect, it } from "vitest"

import { computeEventTimeline } from "@/lib/helper"
import { createTeam, skillOf } from "./helper"

import type { ActionListItem } from "@/shared/types"

import { simulate } from "@/simulation"

describe("echoes: end-to-end", () => {
  describe("fusion: Molten Rift", () => {
    it("Skill: test buffs", () => {
      const team = createTeam("encore")
      const skill = skillOf("encore").skill[1]

      if (!skill) return

      const actionList: ActionListItem[] = [
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
      expect.soft(buffsOnCast).toContain("Molten Rift 2pc")
      expect.soft(buffsOnCast).toContain("Molten Rift 5pc")
    })
  })
  describe("other: Moonlit Clouds", () => {
    describe("fusion: Molten Rift", () => {
      it("Skill: test buffs", () => {
        const team = createTeam("encore", "sanhua")
        const skill1 = skillOf("encore").intro[1]
        const skill2 = skillOf("sanhua").outro[1]

        if (!(skill1 && skill2)) return

        const actionList: ActionListItem[] = [
          {
            characterId: "sanhua",
            skill: skill2,
            time: 0,
          },
          {
            characterId: "encore",
            skill: skill1,
            time: 0,
          },
        ]

        const eventTimeline = computeEventTimeline(actionList)
        const result = simulate(team, eventTimeline)

        const buffsOnCast = result[0].buffs
        const buffsOnOutro = result[1].buffs

        expect.soft(buffsOnCast).toContain("Moonlit Clouds 2pc")
        expect.soft(buffsOnOutro).toContain("Moonlit Clouds 5pc")
      })
    })
  })
})
