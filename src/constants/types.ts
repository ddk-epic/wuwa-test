type Element = "aero" | "electro" | "fusion" | "glacio" | "havoc" | "spectro"

type SkillType =
  | "intro"
  | "outro"
  | "basic"
  | "skill"
  | "heavy"
  | "liberation"
  | "forte"

type Classification = (Element | SkillType)[]

type Skill = {
  name: string
  classification: Classification
  mv: number
  frames: number
  freezetime?: number
  cooldown?: number
  hits: number
  forte: number
  concerto: number
  resonance: number
}

type SkillSequence = {
  1: Skill
} & Record<number, Skill>

type SkillCategory = Record<SkillType, SkillSequence>

export interface CharacterSkills {
  [char: string]: SkillCategory
}

export interface ActionItem {
  char: string
  action: Skill
  time?: number
}
