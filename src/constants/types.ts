type Element = "aero" | "electro" | "fusion" | "glacio" | "havoc" | "spectro"

type SkillBaseType =
  | "basic"
  | "forte"
  | "intro"
  | "heavy"
  | "liberation"
  | "outro"
  | "skill"

type SkillType = SkillBaseType | "echo"

type Skill = {
  name: string
  classifications: (Element | SkillBaseType)[]
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

type SkillCategory = Record<SkillBaseType, SkillSequence>

export interface CharacterSkills {
  [char: string]: SkillCategory
}

export interface ActionItem {
  char: string
  action: Skill
  time?: number
}

export interface BonusStats {
  atkflat: number
  hpflat: number
  defflat: number
  atk: number
  hp: number
  def: number
  er: number
  crit: number
  cdmg: number
  basic: number
  heavy: number
  skill: number
  liberation: number
  /* Element */
  aero: number
  electro: number
  fusion: number
  glacio: number
  havoc: number
  spectro: number
}

type DCondKeys = "Forte" | "Forte2" | "Concerto" | "Resonance"

export interface Weapon {
  name: string
  attack: number
  mainStat: string
  mainStatAmount: number
}

export interface Echo {
  name: string
  damage: number
  castTime: number
  cooldown: number
  set: string
  classifications: (Element | SkillType)[]
  hits: number
}

export interface Character {
  name: string
  sequence: number
  weapon: Weapon
  weaponRank: number
  echo: Echo
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