import { useMemo } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { usePersistedState } from "@/hooks/use-persisted-state"

import {
  aggregateResult,
  computeBaseCharacter,
  computeCharacterSkills,
  computeEventTimeline,
  computeTimeline,
  refreshActionList,
} from "@/lib/helper"

import CalculateButton from "@/components/calculate-button"
import HeaderBar from "@/components/header"
import SequenceList from "@/components/sequence-list"
import SkillSidebar from "@/components/skill-picker"
import EntryDetails from "@/components/entry-details"
import EventTableModal from "@/components/event-table-modal"

import type {
  Action,
  Character,
  CHARACTER_KEY,
  ECHO_KEY,
  ECHO_SET_KEY,
  Result,
  SETTINGS_KEY,
  SKILL,
  TeamSlot,
  TimelineEvent,
  WEAPON_KEY,
} from "@/shared/types"

import characterTemplate from "@/definitions/characters"
import { simulate } from "@/simulation"
import weaponData from "@/definitions/weapons"

export const Route = createFileRoute("/")({ component: App })

function App() {
  const [team, setTeam] = usePersistedState<TeamSlot[]>("team", [])
  const [actionList, setActionList] = usePersistedState<Action[]>(
    "actionList",
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
    const map = new Map<CHARACTER_KEY, Map<string, SKILL>>()

    for (const slot of team) {
      if (!slot.characterId || !slot.settings) continue

      map.set(slot.characterId, computeCharacterSkills(slot.characterId))
    }

    return map
  }, [team])

  const computedEventTimeline = useMemo(() => {
    return computeEventTimeline(actionList)
  }, [actionList])

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

  const updateStaleActionList = (actionList: Action[]) => {
    const skillData = new Map<CHARACTER_KEY, Map<string, SKILL>>()

    for (const slot of team) {
      if (!slot.characterId || !slot.settings) continue
      skillData.set(slot.characterId, computeCharacterSkills(slot.characterId))
    }

    const newActionList = refreshActionList(skillData, actionList)
    setActionList(newActionList)
    console.log("updated stale actionList!")
  }

  const handleAddSkill = (characterId: CHARACTER_KEY, skill: SKILL) => {
    setRawResult([])
    setResult([])
    setActionList((prev) => {
      const newSequence: Action[] = [...prev, { characterId, skill, time: 0 }]
      return computeTimeline(newSequence)
    })
  }

  const handleRemoveSkill = (index: number) => {
    setRawResult([])
    setResult([])
    setActionList((prev) => {
      const newSequence = prev.filter((_, i) => i !== index)
      return computeTimeline(newSequence)
    })
  }

  const handleCalculate = (
    characters: Character[],
    actionList: TimelineEvent[],
  ) => {
    const rawResult = simulate(characters, actionList)
    setRawResult(rawResult)
    const finalResult = aggregateResult(rawResult)
    setResult(finalResult)
  }

  const handleReset = () => {
    setActionList([])
    setRawResult([])
    setResult([])
  }

  return (
    <div className="min-w-270 h-screen flex flex-col">
      <HeaderBar
        team={team}
        characterData={computedCharacterData}
        actionList={actionList}
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
              actionList={actionList}
              result={result}
              onRemoveSkill={handleRemoveSkill}
              refresh={() => updateStaleActionList(actionList)}
            />
            {actionList.length === 0 && (
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
              timeline={computedEventTimeline}
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
