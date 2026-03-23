import { useMemo } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { usePersistedState } from "@/hooks/use-persisted-state"

import {
  aggregateResult,
  computeBaseCharacter,
  computeCharacterSkills,
  computeEventTimeline,
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
  CharacterSkills,
  Result,
  SETTINGS_KEY,
  SKILL,
  TeamSlot,
  TimelineEntry,
} from "@/constants/types"
import characterTemplate, { type CHARACTER_KEY } from "@/constants/characters"
import { totalBuffMap } from "@/constants/maps"
import { weaponData, type WEAPON_KEY } from "@/constants/weapons"
import type { ECHO_KEY, ECHO_SET_KEY } from "@/constants/echoes"
import EventTableModal from "@/components/event-table-modal"
import EntryDetails from "@/components/entry-details"

export const Route = createFileRoute("/")({ component: App })

function App() {
  const [team, setTeam] = usePersistedState<TeamSlot[]>("team", [])
  const [sequence, setSequence] = usePersistedState<ActionListItem[]>(
    "sequence",
    [],
  )
  const [rawResult, setRawResult] = usePersistedState<Result[]>("raw", [])
  const [result, setResult] = usePersistedState<Result[]>("result", [])

  const computedCharacterData = useMemo(() => {
    return team.reduce<Character[]>((acc, slot) => {
      if (!slot.characterId || !slot.settings) return acc

      acc.push(computeBaseCharacter(slot.characterId, slot.settings))

      return acc
    }, [])
  }, [team])

  const computedSkillData = useMemo(() => {
    return team.reduce(
      (acc, slot) => {
        if (!slot.characterId || !slot.settings) return acc

        acc[slot.characterId] = computeCharacterSkills(slot.characterId)

        return acc
      },
      {} as Record<CHARACTER_KEY, CharacterSkills>,
    )
  }, [team])

  const computedEventTimeline = useMemo(() => {
    return computeEventTimeline(sequence)
  }, [sequence])

  const handleCharacterChange = (selectedIds: CHARACTER_KEY[]) => {
    if (selectedIds.length > 3) return // Cap at 3 characters

    const newTeam: TeamSlot[] = []

    for (const characterId of selectedIds) {
      const exists = team.find((slot) => slot.characterId === characterId)
      if (exists) {
        // Preserve existing settings
        newTeam.push(exists)
        continue
      }

      const template = characterTemplate[characterId]
      if (!template) continue

      const { id, weapon, echoSet, echo } = template
      const newCharacter: TeamSlot = {
        characterId: id,
        settings: {
          sequence: 0,
          weapon,
          echoSet,
          echo,
        },
      }

      newTeam.push(newCharacter)
    }

    setTeam(newTeam)
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
      if (!slot.characterId || !slot.settings) return prev

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

  const handleAddSkill = (characterId: CHARACTER_KEY, skill: SKILL) => {
    setRawResult([])
    setResult([])
    setSequence((prev) => {
      const newSequence: ActionListItem[] = [
        ...prev,
        { characterId, skill, time: 0 },
      ]
      return computeTimeline(newSequence)
    })
  }

  const handleRemoveSkill = (index: number) => {
    setRawResult([])
    setResult([])
    setSequence((prev) => {
      const newSequence = prev.filter((_, i) => i !== index)
      return computeTimeline(newSequence)
    })
  }

  const handleCalculate = (
    characters: Character[],
    actionList: TimelineEntry[],
  ) => {
    const rawResult = calculate(characters, actionList, totalBuffMap)
    setRawResult(rawResult)
    const finalResult = aggregateResult(rawResult)
    setResult(finalResult)
  }

  const handleReset = () => {
    setSequence([])
    setRawResult([])
    setResult([])
  }

  return (
    <div className="min-w-270 h-screen flex flex-col">
      <HeaderBar
        team={team}
        characterData={computedCharacterData}
        sequence={sequence}
        result={result}
        onCharacterChange={handleCharacterChange}
        updateCharSettings={updateCharSettings}
        onReset={handleReset}
      />
      {/* Main section */}
      <div className="h-[90vh] flex flex-1 overflow-hidden">
        <EntryDetails />
        <main className="relative flex">
          <div className="flex-col pl-7 pr-3 overflow-auto [scrollbar-gutter:stable]">
            <SequenceList
              sequence={sequence}
              result={result}
              onRemoveSkill={handleRemoveSkill}
            />
            {sequence.length === 0 && (
              <div className="h-80 flex items-center justify-center border border-dashed">
                <p className="text-md text-muted-foreground">
                  Add skills from the sidebar to build your rotation.
                </p>
              </div>
            )}
          </div>
          {/* Calculate button */}
          <div className="absolute bottom-4 right-6 flex gap-2">
            <EventTableModal resultTimeline={rawResult} />
            <CalculateButton
              characterData={computedCharacterData}
              sequence={computedEventTimeline}
              handleCalculate={handleCalculate}
            />
          </div>
        </main>
        {/* Side section */}
        <SkillSidebar
          characterData={computedCharacterData}
          skillData={computedSkillData}
          onAddSkill={handleAddSkill}
        />
      </div>
    </div>
  )
}
