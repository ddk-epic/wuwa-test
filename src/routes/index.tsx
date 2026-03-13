import { useMemo } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { usePersistedState } from "@/hooks/use-persisted-state"

import {
  computeBaseCharacter,
  computeCharacterSkills,
  computeTimeline,
} from "@/lib/helper"
import { calculate } from "@/lib/calculations"

import CalculateButton from "@/components/calculate-button"
import HeaderBar from "@/components/header"
import SequenceList from "@/components/sequence-list"
import SkillSidebar from "@/components/skill-picker"

import type {
  ActionListItem,
  Character,
  Result,
  SETTINGS_KEY,
  Skill,
  TeamSlot,
} from "@/constants/types"
import characterTemplate, {
  type CHARACTER_KEY,
  type CHARACTER_SELECTION_KEY,
} from "@/constants/characters"
import { totalBuffMap } from "@/constants/maps"
import { weaponData, type WEAPON_KEY } from "@/constants/weapons"
import type { ECHO_KEY, ECHO_SET_KEY } from "@/constants/echoes"

export const Route = createFileRoute("/")({ component: App })

function App() {
  const [team, setTeam] = usePersistedState<TeamSlot[]>("team", [
    { character: null, settings: null },
    { character: null, settings: null },
    { character: null, settings: null },
  ])
  const [sequence, setSequence] = usePersistedState<ActionListItem[]>(
    "sequence",
    [],
  )
  const [result, setResult] = usePersistedState<Result[]>("result", [])

  const computedChars = useMemo(() => {
    return team.reduce(
      (acc, slot) => {
        if (!slot.character || !slot.settings) return acc

        const char = computeBaseCharacter(slot.character, slot.settings)
        acc[char.id] = char

        return acc
      },
      {} as Record<CHARACTER_KEY, Character>,
    )
  }, [team])

  const computedSkills = useMemo(() => {
    return team.reduce(
      (acc, slot) => {
        if (!slot.character || !slot.settings) return acc

        acc[slot.character.id] = computeCharacterSkills(slot.character)

        return acc
      },
      {} as Record<CHARACTER_KEY, Record<string, Skill[]>>,
    )
  }, [team])

  const handleCharacterChange = (
    index: number,
    value: CHARACTER_SELECTION_KEY,
  ) => {
    const oldChar = team[index].character
    const newChar = value === "__none__" ? null : value

    setTeam((prev) => {
      const newTeam = [...prev]

      if (!newChar) {
        newTeam[index].character = null
        newTeam[index].settings = null
      } else {
        newTeam[index] = {
          character: characterTemplate[newChar],
          settings: {
            sequence: 0,
            weapon: characterTemplate[newChar].weapon,
            echoSet: [...characterTemplate[newChar].echoSet],
            echo: characterTemplate[newChar].echo,
          },
        }
      }
      return newTeam
    })

    setSequence((prev) =>
      oldChar ? prev.filter((s) => s.char !== oldChar.id) : prev,
    )
  }

  const updateCharSettings = (
    index: number,
    label: SETTINGS_KEY,
    value: string,
  ) => {
    if (!team[index].settings) return

    setTeam((prev) => {
      const newTeam = [...prev]
      const slot = newTeam[index]
      if (!slot.character || !slot.settings) return prev

      const newSetting = { ...slot.settings }

      switch (label) {
        case "sequence":
          newSetting.sequence = Number(value)
          break

        case "weapon":
          newSetting.weapon = weaponData[value as WEAPON_KEY]
          break

        case "echoSet":
          if (newSetting.echoSet.length >= 2) {
            console.error("Cannot add more echo sets")
            return prev
          }
          // TODO: fix echo set update
          newSetting.echoSet = [...newSetting.echoSet, value as ECHO_SET_KEY]
          break

        case "echo":
          newSetting.echo = value as ECHO_KEY
      }

      newTeam[index] = {
        ...slot,
        settings: newSetting,
      }

      return newTeam
    })
  }

  const handleAddSkill = (char: CHARACTER_KEY, skill: Skill) => {
    setResult([])
    setSequence((prev) => {
      const newSequence: ActionListItem[] = [...prev, { char, skill, time: 0 }]
      return computeTimeline(newSequence)
    })
  }

  const handleRemoveSkill = (index: number) => {
    setResult([])
    setSequence((prev) => {
      const newSequence = prev.filter((_, i) => i !== index)
      return computeTimeline(newSequence)
    })
  }

  const handleCalculate = (
    characterData: Record<CHARACTER_KEY, Character>,
    actionList: ActionListItem[],
  ) => {
    const result = calculate(characterData, actionList, totalBuffMap)
    setResult(result)
  }

  const handleReset = () => {
    setSequence([])
    setResult([])
  }

  return (
    <div className="min-w-270 h-screen flex flex-col">
      <HeaderBar
        team={team}
        sequence={sequence}
        result={result}
        charData={computedChars}
        onCharacterChange={handleCharacterChange}
        updateCharSettings={updateCharSettings}
        onReset={handleReset}
      />
      {/* Main section */}
      <div className="h-[90vh] flex flex-1 overflow-hidden">
        <main className="relative flex flex-col flex-1">
          <SequenceList
            sequence={sequence}
            result={result}
            onRemoveSkill={handleRemoveSkill}
          />
          {/* Calculate button */}
          <div className="absolute bottom-4 right-6">
            <CalculateButton
              charData={computedChars}
              sequence={sequence}
              handleCalculate={handleCalculate}
            />
          </div>
        </main>
        {/* Side section */}
        <SkillSidebar
          team={team}
          skillData={computedSkills}
          onAddSkill={handleAddSkill}
        />
      </div>
    </div>
  )
}
