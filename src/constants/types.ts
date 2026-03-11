import type { BONUS_STAT_KEY, CHARACTER_KEY } from "./characters"
import type { ECHO_KEY, ECHO_SET_KEY } from "./echoes"
import type { WEAPON_KEY, WEAPON_STAT } from "./weapons"

export type Element =
  | "aero"
  | "electro"
  | "fusion"
  | "glacio"
  | "havoc"
  | "spectro"

export type SkillBaseType =
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
  | "heal"
  | "physical"
  | "allEle"
  | "concerto"
  | "resonance"
  | "none"

export type BuffCategory =
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
  source: string
  // classifications?: (Element | BuffType)[]
  triggeredBy?: (string | SkillBaseType | "echo")[]
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
  source: string
  createdBy: string[]
  triggeredBy?: (string | SkillBaseType | "echo")[]
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

type SkillVariation = {
  mv?: number
  frames?: number
  hits?: number
  concerto?: number
  resonance?: number
}

export type Skill = {
  name: string
  category: SkillBaseType | "echo"
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
  variations?: Record<string, SkillVariation>
}

export type Echo = { set: string } & Skill

type SkillSequence = {
  1: Skill | null
} & Record<number, Skill | null>

type SkillCategory = Record<SkillBaseType, SkillSequence>

export interface CharacterSkills {
  [char: string]: SkillCategory
}

export type ActionItem = {
  char: Exclude<CHARACTER_KEY, "__none__">
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
  buffs?: ActiveBuffObject[]
  buffMap: string[]
}

export type BonusStats = Record<BONUS_STAT_KEY, number>

type DCondKeys = "Forte" | "Forte2" | "Concerto" | "Resonance"

export interface Weapon {
  name: WEAPON_KEY
  type: string
  rank: number
  atk: number
  mainStat: WEAPON_STAT
  mainStatAmount: number
}

export interface Character {
  id: Exclude<CHARACTER_KEY, "__none__">
  name: string
  sequence: number
  weaponType: string
  weapon: Weapon
  echo: ECHO_KEY
  echoSet: ECHO_SET_KEY[]
  build: string
  element: Element
  bonus1: BONUS_STAT_KEY
  bonus2: BONUS_STAT_KEY | "heal"
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

export interface CharSettings {
  sequence: number
  weapon: Weapon
  echoSet: ECHO_SET_KEY[]
  echo: ECHO_KEY
}

export type SETTINGS_KEYS = "sequence" | "weapon" | "echoSet" | "echo"

export type TeamSlot =
  | {
      character: null
      settings: null
    }
  | {
      character: Character
      settings: CharSettings
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
