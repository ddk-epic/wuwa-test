type Element =
  | "aero"
  | "electro"
  | "fusion"
  | "glacio"
  | "havoc"
  | "spectro"
  | null

type SkillBaseType =
  | "basic"
  | "forte"
  | "intro"
  | "heavy"
  | "liberation"
  | "outro"
  | "skill"

export type BuffType =
  | "atk"
  | "def"
  | "hp"
  | "er"
  | "crit"
  | "critDmg"
  | "basic"
  | "heavy"
  | "skill"
  | "liberation"
  | "all"
  | "baDeep"
  | "heDeep"
  | "skDeep"
  | "liDeep"
  | "allDeep"
  | "aero"
  | "electro"
  | "fusion"
  | "glacio"
  | "havoc"
  | "spectro"
  | "bonus"
  | "amp"
  | "multiplier"
  | "resIgnore"
  | "defIgnore"
  | "erMulti"
  | "foMulti"
  | "physical"
  | "allEle"
  | "concerto"
  | "resonance"
  | "none"

type BuffCategory =
  | "Buff"
  | "BuffBonus"
  | "BuffConsume"
  | "BuffEnergy"
  | "BuffNext"
  | "BuffStacking"
  | "BuffOffField"
  | "Damage"

export type BuffObject = {
  name: string
  type: BuffCategory
  owner: string | null
  // classifications?: (Element | BuffType)[]
  createdBy: string[]
  triggeredBy?: string[]
  appliesTo: string
  modifier: BuffType[]
  consumedBy?: string[]
  stackLimit?: number
  stackInterval?: number
  sequenceReq?: number
  value: number
  duration: number
  forte?: number
  forte2?: number
  concerto?: number
  resonance?: number
}

export type WeaponBuffObject = {
  name: string
  type: BuffCategory
  createdBy: string[]
  triggeredBy?: string[]
  appliesTo: string
  modifier: BuffType[]
  stackLimit?: number
  stackInterval?: number
  value: number[]
  duration: number
}

export type ActiveBuffObject = {
  endTime: number
} & BuffObject

export type Skill = {
  name: string
  category: string
  classifications: (Element | SkillBaseType | "echo")[]
  mv: number
  frames: number
  freezetime?: number
  cooldown?: number
  hits: number
  forte?: number
  forte2?: number
  concerto: number
  resonance: number
}

export type Echo = { set: string } & Skill

type SkillSequence = {
  1: Skill
} & Record<number, Skill>

type SkillCategory = Record<SkillBaseType, SkillSequence>

export interface CharacterSkills {
  [char: string]: SkillCategory
}

export type ActionItem = {
  char: string
  skill: Skill
}

export type ActionListItem = {
  time: number
} & ActionItem

export type ActionList = ActionListItem[]

export type Result = {
  row: number
  char: string
  skill: Skill
  time: number
  concerto: number
  resonance: number
  damage: number
  procc: Procc
  buffs?: BuffObject[]
  buffMap: number[]
}

export type ResultList = Result[]

export interface BonusStats {
  atkFlat: number
  hpFlat: number
  defFlat: number
  atk: number
  hp: number
  def: number
  er: number
  crit: number
  critDmg: number
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
  rank: number
  atk: number
  mainStat: string
  mainStatAmount: number
}

export interface Character {
  name: string
  sequence: number
  weapon: Weapon
  echo: string
  echoSet: string[]
  build: string
  element: string
  maxForte: number
  maxForte2: number
  /* stats */
  atk: number
  def: number
  hp: number
  crit: number
  critDmg: number
  bonusStats: BonusStats
  dCond: Record<DCondKeys, number>
}

export type BuffMap = Record<BuffType, number>

type Procc = {
  damage: number
  heal: number
  shield: number
}

export type Context = {
  activeBuffs: Record<string, ActiveBuffObject[]>
  activeCharacter: string
  allBuffs: BuffObject[]
  allSkills: Skill[]
  buffMap: Record<string, BuffMap>
  buffNext: ActiveBuffObject[]
  buffDeferred: ActiveBuffObject[]
  characters: Record<string, Character>
  hasSwapped: boolean
  prevChar: string
  procc: Procc
  row: number
  time: number
}
