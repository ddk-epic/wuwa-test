import { createFileRoute } from "@tanstack/react-router"

import calculate from "@/lib/calculations"
import { usePersistedState } from "@/hooks/use-persisted-state"

import CalculateButton from "@/components/calculate-button"
import HeaderBar from "@/components/header"
import SequenceList from "@/components/sequence-list"
import SkillSidebar from "@/components/skill-picker"

import type {
  ActionListItem,
  Character,
  Result,
  Skill,
} from "@/constants/types"
import characterTemplate, { type CHARACTER_KEY } from "@/constants/characters"
import { totalBuffMap } from "@/constants/maps"
import { weaponData } from "@/constants/weapons"

export const Route = createFileRoute("/")({ component: App })

function App() {
  const [characters, setCharacters] = usePersistedState<
    (CHARACTER_KEY | null)[]
  >("characters", [null, null, null])
  const [charData, setCharData] = usePersistedState<(Character | null)[]>(
    "charData",
    [null, null, null],
  )
  const [sequence, setSequence] = usePersistedState<ActionListItem[]>(
    "sequence",
    [],
  )
  const [result, setResult] = usePersistedState<Result[]>("result", [])

  const handleAddSkill = (
    char: CHARACTER_KEY,
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

  const handleCharacterChange = (index: number, value: CHARACTER_KEY) => {
    const oldChar = characters[index]
    const newChar = value === "__none__" ? null : value

    setCharacters((prev) => {
      const updated = [...prev]
      updated[index] = newChar
      return updated
    })

    setCharData((prev) => {
      const updatedCharData = [...prev]
      // processCharacterData()
      updatedCharData[index] = newChar ? characterTemplate[newChar] : null
      return updatedCharData
    })

    setSequence((prev) =>
      oldChar ? prev.filter((s) => s.char !== oldChar) : prev,
    )
  }

  const updateCharData = (
    index: number,
    label: "sequence" | "weapon" | "echoSet",
    value: CHARACTER_KEY,
  ) =>
    setCharData((prev) => {
      const updatedCharData = [...prev]

      if (!updatedCharData[index]) return prev

      const updatedChar = { ...updatedCharData[index] }

      if (label === "sequence") {
        updatedChar.sequence = Number(value)
      }

      if (label === "weapon") {
        updatedChar.weapon = weaponData[value]
      }

      if (label === "echoSet") {
        if (updatedChar.echoSet.length < 2) {
          updatedChar.echoSet = [...updatedChar.echoSet, value]
        } else {
          console.log("ERROR:", "Cannot add more echo sets")
        }
      }

      updatedCharData[index] = updatedChar
      return updatedCharData
    })

  const handleCalculate = (
    characters: (CHARACTER_KEY | null)[],
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
        characters={characters}
        sequence={sequence}
        result={result}
        charData={charData}
        onCharacterChange={handleCharacterChange}
        updateCharData={updateCharData}
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
              characters={characters}
              sequence={sequence}
              handleCalculate={handleCalculate}
            />
          </div>
        </main>
        {/* Side section */}
        <SkillSidebar
          characters={characters}
          sequence={sequence}
          onAddSkill={handleAddSkill}
        />
      </div>
    </div>
  )
}
