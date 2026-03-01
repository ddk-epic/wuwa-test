import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"

import HeaderBar from "@/components/header"
import SequenceList from "@/components/sequence-list"
import SkillSidebar from "@/components/skill-picker"

import type { ActionListItem, Skill } from "@/constants/types"

export const Route = createFileRoute("/")({ component: App })

function App() {
  const [characters, setCharacters] = useState<(string | null)[]>([
    null,
    null,
    null,
  ])
  const [sequence, setSequence] = useState<ActionListItem[]>([])

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
  return (
    <div className="min-w-260 flex h-screen flex-col overflow-hidden">
      <HeaderBar
        characters={characters}
        sequence={sequence}
        setCharacters={setCharacters}
        setSequence={setSequence}
      />
      <div className="flex flex-1 overflow-hidden">
        {/* Main */}
        <SequenceList
          sequence={sequence}
          onRemoveSkill={handleRemoveSkill}
        />
        <div className="w-64 shrink-0 border-l">
          <SkillSidebar
            characters={characters}
            sequence={sequence}
            onAddSkill={handleAddSkill}
          />
        </div>
      </div>
    </div>
  )
}
