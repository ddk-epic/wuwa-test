import { useState } from "react"
import { cn } from "@/lib/utils"

import type { Skill, ActionListItem } from "@/constants/types"
import team from "@/constants/characters"
import { ELEMENT_COLORS } from "@/constants/colors"
import skills from "@/constants/skills"

interface SkillSidebarProps {
  characters: (string | null)[]
  sequence: ActionListItem[]
  onAddSkill: (char: string, skill: Skill, sequence: ActionListItem[]) => void
}

function SkillSidebar({ characters, sequence, onAddSkill }: SkillSidebarProps) {
  const [activeTab, setActiveTab] = useState(0)

  const activeChar = characters[activeTab] ?? characters[0]

  return (
    <div className="w-72 shrink-0 border-l bg-card opacity-85">
      <aside className="h-full flex flex-col overflow-hidden border">
        <div className="px-3 py-2 border-b">
          <p className="text-xs column-header">Skills</p>
        </div>
        {/* Character tabs */}
        <div className="flex border-b">
          {characters.map((char, i) => {
            if (!char || !team[char]) return null
            const element = team[char].element || "default"

            return (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={cn(
                  "flex-1 px-2 py-2 text-xs font-sans transition-colors",
                  activeTab === i
                    ? cn(
                        "border-b-2 bg-secondary/50 text-foreground",
                        ELEMENT_COLORS[element]?.border ?? "border-primary",
                      )
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/30",
                )}
              >
                <span
                  className={cn("block", ELEMENT_COLORS[element]?.text ?? "")}
                >
                  {char.charAt(0).toUpperCase() + char.slice(1)}
                </span>
                <span className="text-xs font-mono uppercase">{element}</span>
              </button>
            )
          })}
        </div>
        {/* Skill list */}
        <div className="flex-1 overflow-y-auto p-1.5 pr-px [scrollbar-gutter:stable]">
          {activeChar && (
            <div className="flex flex-col gap-1">
              {Object.values(skills[activeChar] ?? {}).map((skillSequence) => {
                return Object.values(skillSequence).map((skill) => {
                  if (!skill) return
                  
                  return (
                    <button
                      key={skill.name}
                      onClick={() => onAddSkill(activeChar, skill, sequence)}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-2.5 py-0.5 text-left transition-colors hover:bg-secondary",
                      )}
                    >
                      <span className="shrink-0 px-1.5 py-0.5 rounded text-xs font-mono font-semibold uppercase tracking-wider">
                        {skill.category.slice(0, 5)}
                      </span>
                      <span className="flex-1 text-sm text-foreground truncate">
                        {skill.name}
                      </span>
                      <span className="shrink-0 text-xs font-mono text-muted-foreground">
                        {(skill.frames / 60).toFixed(2)}
                      </span>
                    </button>
                  )
                })
              })}
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}

export default SkillSidebar
