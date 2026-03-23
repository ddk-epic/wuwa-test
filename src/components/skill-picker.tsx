import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

import { SelectSeparator } from "./ui/select"

import type { Character, CharacterSkills, SKILL } from "@/constants/types"
import { type CHARACTER_KEY } from "@/constants/characters"
import { ELEMENT_COLORS } from "@/constants/colors"

interface SkillSidebarProps {
  characterData: Character[]
  skillData: Record<CHARACTER_KEY, CharacterSkills>
  onAddSkill: (characterId: CHARACTER_KEY, skill: SKILL) => void
}

function SkillSidebar({
  characterData,
  skillData,
  onAddSkill,
}: SkillSidebarProps) {
  const [activeTab, setActiveTab] = useState<number>(() => {
    const index = characterData.findIndex((character) => character != null)
    return index === -1 ? 0 : index
  })

  useEffect(() => {
    const oldIndex = activeTab
    const newIndex = characterData.findIndex((character) => character.id)
    if (!characterData[oldIndex]) {
      setActiveTab(newIndex)
    }
  }, [characterData])

  const activeCharacter = characterData[activeTab]

  function CharacterTab() {
    if (!activeCharacter) return null

    return (
      <div className="flex border-b">
        {characterData.map((character, i) => {
          if (!character) return null
          const element = character.element || "default"

          return (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={cn(
                "flex-1 px-2 py-2 text-xs font-sans transition-colors tracking-wide",
                activeTab === i
                  ? cn(
                      "border-b-2 bg-secondary/50 text-foreground",
                      ELEMENT_COLORS[element]?.border ?? "border-primary",
                    )
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/30",
              )}
            >
              <span className={cn("block", ELEMENT_COLORS[element]?.text)}>
                {character.name}
              </span>
              <span className="text-[12px] font-mono uppercase">{element}</span>
            </button>
          )
        })}
      </div>
    )
  }

  function CharacterSkills() {
    if (!activeCharacter) return null

    const characterId = activeCharacter.id
    const element = activeCharacter.element || "default"
    const echoSkills = skillData[characterId]?.echoSkills ?? []
    const characterSkills = skillData[characterId]?.characterSkills ?? []

    return (
      <div className="flex flex-col gap-1">
        {/* Echo skill */}
        {echoSkills.map((echoSkill) => (
          <button
            key={echoSkill.name}
            onClick={() => onAddSkill(activeCharacter.id, echoSkill)}
            className={cn(
              "flex items-center gap-2 rounded-md px-2.5 py-0.5 text-left transition-colors hover:bg-secondary",
            )}
          >
            <span className="w-11.5 shrink-0 px-1.5 pt-0.5 rounded text-[13px] font-mono font-semibold uppercase tracking-wider">
              {echoSkill.category}
            </span>
            <span className="flex-1 text-sm text-foreground truncate">
              {echoSkill.name}
            </span>
            <span className="shrink-0 text-xs font-mono text-muted-foreground">
              {(echoSkill.frames / 60).toFixed(2)}
            </span>
          </button>
        ))}
        <SelectSeparator className="ml-4 mr-3 my-px" />
        {/* Character skills */}
        {characterSkills.map((skill) => {
          if (!skill) return

          return (
            <button
              key={skill.name}
              onClick={() => onAddSkill(activeCharacter.id, skill)}
              className={cn(
                "flex items-center gap-2 rounded-md px-2.5 py-0.5 text-left transition-colors hover:bg-secondary",
              )}
            >
              <span className="w-11.5 shrink-0 px-1.5 pt-0.5 rounded text-[13px] font-mono font-semibold uppercase tracking-wider">
                {skill.category.slice(0, 5)}
              </span>
              <span
                className={cn(
                  "flex-1 text-sm text-foreground truncate",
                  skill.category === "liberation"
                    ? ELEMENT_COLORS[element]?.text
                    : "",
                )}
              >
                {skill.name}
              </span>
              <span className="shrink-0 text-xs font-mono text-muted-foreground">
                {(skill.frames / 60).toFixed(2)}
              </span>
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <aside className="w-72 h-full flex flex-col shrink-0 bg-card border opacity-85 overflow-hidden">
        <div className="px-3 py-2 border-b">
          <p className="text-xs column-header">Skills</p>
        </div>
        <CharacterTab />
        {/* Skill list */}
        <div className="flex-1 p-1.5 pr-px overflow-y-auto [scrollbar-gutter:stable]">
          <CharacterSkills />
        </div>
    </aside>
  )
}

export default SkillSidebar
