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
import { cn } from "@/lib/utils"

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
    <div className="min-w-270 h-screen flex flex-col">
      <HeaderBar
        characters={characters}
        sequence={sequence}
        result={result}
        onSelect={handleSelect}
        onReset={handleReset}
      />
      {/* Main section */}
      <div className="flex flex-1 overflow-hidden">
        <main className="relative flex flex-col flex-1">
          {/* TODO: fix header behaviour */}
          <div className="w-full flex pl-4">
            {/* Sequence Header */}
            <div className="flex-1 mb-1 border-l border-t bg-card overflow-hidden opacity-85">
              <div className="flex gap-4 px-3 py-2 border-b">
                <span className="w-2 text-xs column-header"></span>
                <span className="w-17.5 text-xs column-header">Character</span>
                <span className="text-xs column-header">Skill</span>
                <span className="pr-6 ml-auto text-xs column-header">
                  Time&thinsp;(s)
                </span>
              </div>
            </div>
            {/* Result header */}
            {result.length > 0 && (
              <>
                <div className="flex-1 mb-1 border-t bg-card overflow-hidden opacity-85">
                  <div className="flex gap-4 px-3 py-2 border-b">
                    <span className="w-8 ml-5 text-right text-xs column-header">
                      Con.
                    </span>
                    <span className="w-15 mr-6 text-right text-xs column-header">
                      Res.
                    </span>
                    <span className="w-13 text-xs column-header">Damage</span>
                    <span className="w-20 text-xs column-header">+Dmg</span>
                  </div>
                  
                </div>
              </>
            )}
            {/* Layout filler */}
            <div
              className={cn(
                "w-6 mb-1 overflow-hidden opacity-85",
                result.length > 0 ? "border-y bg-card" : "border-l",
              )}
            ></div>
          </div>
          <div className="flex flex-1 pl-4 pr-3 overflow-auto [scrollbar-gutter:stable]">
            <SequenceList
              sequence={sequence}
              onRemoveSkill={handleRemoveSkill}
            />
            <ResultList result={result} setResult={setResult} />
          </div>
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
