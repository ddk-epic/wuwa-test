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

export interface BonusStats {
  "Flat Attack": 0
  "Flat Health": 0
  "Flat Defense": 0
  Attack: 0.182
  Health: 0
  Defense: 0
  "Energy Regen": 0.2
  Crit: 0.405
  "Crit Dmg": 0.81
  Basic: 0
  Heavy: 0
  Skill: 0
  Liberation: 0
  /* Element */
  Aero: 0
  Electro: 0
  Fusion: 0
  Glacio: 0
  Havoc: 0
  Spectro: 0
}

type DCondKeys = "Forte" | "Forte2" | "Concerto" | "Resonance"

export interface Character {
  name: string
  sequence: number
  weapon: string
  weaponRank: number
  echo: string
  echoSet: string
  build: string
  element: string
  maxForte: number
  maxForte2: number
  /* stats */
  attack: number
  defense: number
  health: number
  crit: number
  critDmg: number
  bonusStats: BonusStats
  dCond: Map<DCondKeys, number>
}
