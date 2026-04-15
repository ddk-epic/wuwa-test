import { describe, expect, it } from "vitest"

import { computeEventTimeline } from "@/lib/helper"
import { createTeam, skillOf } from "./helper"

import type { Action } from "@/shared/types"

import { simulate } from "@/simulation"

describe("echoSet: end-to-end", () => {
  describe("fusion: Molten Rift", () => {
    const characters = createTeam("encore")

    it("Molten Rift 2-set", () => {
      const team = characters
      const skill = skillOf("encore").basic[1]

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

      const buffsOnCast = result[0].buffs

      expect.soft(buffsOnCast).toContain("Molten Rift 2pc")
    })

    it("Molten Rift 5-set", () => {
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

      const buffsOnCast = result[0].buffs

      expect.soft(buffsOnCast).toContain("Molten Rift 5pc")
    })
  })

  describe("other: Moonlit Clouds", () => {
    const team = createTeam("encore", "sanhua")

    it("Moonlit Clouds 2-set", () => {
      const skill1 = skillOf("sanhua").basic[1]

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

      const buffsOnCast = result[0].buffs // sanhua basic 1

      expect.soft(result[0].statMap.er).toBeCloseTo(1.1)
      expect.soft(buffsOnCast).toContain("Moonlit Clouds 2pc")
    })

    it("Moonlit Clouds 5-set", () => {
      const team = createTeam("encore", "sanhua")
      const skill1 = skillOf("sanhua").outro[1]
      const skill2 = skillOf("encore").intro[1]

      if (!(skill1 && skill2)) return

      const actionList: Action[] = [
        {
          characterId: "sanhua",
          skill: skill1,
          time: 0,
        },
        {
          characterId: "encore",
          skill: skill2,
          time: 0,
        },
      ]

      const eventTimeline = computeEventTimeline(actionList)
      const result = simulate(team, eventTimeline)

      const buffsOnCast = result[1].buffs // encore intro

      expect.soft(buffsOnCast).toContain("Moonlit Clouds 5pc")
    })
  })
})
