import { createFileRoute } from "@tanstack/react-router"

import calculate from "@/lib/calculations"
import { usePersistedState } from "@/hooks/use-persisted-state"

import CalculateButton from "@/components/calculate-button"
import HeaderBar from "@/components/header"
import ResultList from "@/components/result-list"
import SequenceList from "@/components/sequence-list"
import SkillSidebar from "@/components/skill-picker"

import type { ActionListItem, Result, Skill } from "@/constants/types"
import { totalBuffMap } from "@/constants/maps"

export const Route = createFileRoute("/")({ component: App })

function App() {
  const [characters, setCharacters] = usePersistedState<(string | null)[]>(
    "characters",
    [null, null, null],
  )
  const [sequence, setSequence] = usePersistedState<ActionListItem[]>(
    "sequence",
    [],
  )
  const [result, setResult] = usePersistedState<Result[]>("result", [])

  const handleAddSkill = (
    char: string,
    skill: Skill,
    sequence: ActionListItem[],
  ) => {
    const time =
      sequence.reduce((acc, entry) => acc + entry.skill.frames, 0) / 60
    const actionObj: ActionListItem = { char, skill, time }
    setSequence((prev) => [...prev, actionObj])
  }

  const handleRemoveSkill = (index: number) => {
    setSequence((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSelect = (index: number, value: string) => {
    const newSlots = [...characters]
    newSlots[index] = value
    setCharacters(newSlots)
  }

  const handleCalculate = (
    characters: (string | null)[],
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
    <div className="min-w-270 h-screen flex flex-col overflow-hidden">
      <HeaderBar
        characters={characters}
        sequence={sequence}
        onSelect={handleSelect}
        onReset={handleReset}
      />
      <div className="flex flex-1 overflow-hidden">
        <main className="relative flex flex-1 px-4 overflow-auto">
          {/* Main */}
          <SequenceList sequence={sequence} onRemoveSkill={handleRemoveSkill} />
          <ResultList result={result} setResult={setResult} />
          {/* Calculate button */}
          <div className="absolute bottom-4 right-4">
            <CalculateButton
              characters={characters}
              sequence={sequence}
              handleCalculate={handleCalculate}
            />
          </div>
        </main>
        <SkillSidebar
          characters={characters}
          sequence={sequence}
          onAddSkill={handleAddSkill}
        />
      </div>
    </div>
  )
}
