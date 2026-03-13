import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

import { SelectSeparator } from "./ui/select"

import type { Skill, TeamSlot } from "@/constants/types"
import { type CHARACTER_KEY } from "@/constants/characters"
import { ELEMENT_COLORS } from "@/constants/colors"

interface SkillSidebarProps {
  team: TeamSlot[]
  skillData: Record<CHARACTER_KEY, Record<string, Skill[]>>
  onAddSkill: (characterId: CHARACTER_KEY, skill: Skill) => void
}

function SkillSidebar({ team, skillData, onAddSkill }: SkillSidebarProps) {
  const [activeTab, setActiveTab] = useState<number>(() => {
    const index = team.findIndex((c) => c !== null)
    return index === -1 ? 0 : index
  })

  useEffect(() => {
    const oldIndex = activeTab
    const newIndex = team.findIndex((c) => c.character !== null)
    if (!team[oldIndex]) {
      setActiveTab(newIndex)
    }
  }, [team])

  const activeChar = team[activeTab].character ?? null

  function CharacterTab() {
    if (!activeChar) return null
    return (
      <div className="flex border-b">
        {team.map((slot, i) => {
          const character = slot.character
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
    if (!activeChar) return null
    const element = activeChar.element || "default"
    const { echoSkills, characterSkills } = skillData[activeChar.id]

    return (
      <div className="flex flex-col gap-1">
        {/* Echo skill */}
        {echoSkills.map((echoSkill) => (
          <button
            key={echoSkill.name}
            onClick={() => onAddSkill(activeChar.id, echoSkill)}
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
              onClick={() => onAddSkill(activeChar.id, skill)}
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
    <div className="w-72 shrink-0 border-l bg-card opacity-85">
      <aside className="h-full flex flex-col overflow-hidden border">
        <div className="px-3 py-2 border-b">
          <p className="text-xs column-header">Skills</p>
        </div>
        <CharacterTab />
        {/* Skill list */}
        <div className="flex-1 overflow-y-auto p-1.5 pr-px [scrollbar-gutter:stable]">
          <CharacterSkills />
        </div>
      </aside>
    </div>
  )
}

export default SkillSidebar
