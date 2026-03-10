import { useMemo } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { usePersistedState } from "@/hooks/use-persisted-state"

import calculate from "@/lib/calculations"

import CalculateButton from "@/components/calculate-button"
import HeaderBar from "@/components/header"
import SequenceList from "@/components/sequence-list"
import SkillSidebar from "@/components/skill-picker"

import type {
  ActionListItem,
  Character,
  Result,
  SETTINGS_KEYS,
  Skill,
  TeamSlot,
} from "@/constants/types"
import characterTemplate, { type CHARACTER_KEY } from "@/constants/characters"
import { totalBuffMap } from "@/constants/maps"
import { weaponData, type WEAPON_KEY } from "@/constants/weapons"
import type { ECHO_KEY, ECHO_SET_KEY } from "@/constants/echoes"
import { computeBaseCharacter } from "@/lib/helper"

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
      {} as Record<Exclude<CHARACTER_KEY, "__none__">, Character>,
    )
  }, [team])

  const handleCharacterChange = (index: number, value: CHARACTER_KEY) => {
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
      oldChar ? prev.filter((s) => s.char !== oldChar.name) : prev,
    )
  }

  const updateCharSettings = (
    index: number,
    label: SETTINGS_KEYS,
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

      console.log("newSetting", newSetting)

      newTeam[index] = {
        ...slot,
        settings: newSetting,
      }

      return newTeam
    })
  }

  const handleAddSkill = (
    char: Exclude<CHARACTER_KEY, "__none__">,
    skill: Skill,
    sequence: ActionListItem[],
  ) => {
    setResult([])
    const time =
      sequence.reduce((acc, entry) => acc + entry.skill.frames, 0) / 60
    const actionObj: ActionListItem = { char, skill, time }
    setSequence((prev) => [...prev, actionObj])
  }

  const handleRemoveSkill = (index: number) => {
    setResult([])
    setSequence((prev) => prev.filter((_, i) => i !== index))
  }

  const handleCalculate = (
    characters: Record<Exclude<CHARACTER_KEY, "__none__">, Character>,
    actionList: ActionListItem[],
  ) => {
    const result = calculate(characters, actionList, totalBuffMap)
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
            charData={computedChars}
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
          sequence={sequence}
          onAddSkill={handleAddSkill}
        />
      </div>
    </div>
  )
}
