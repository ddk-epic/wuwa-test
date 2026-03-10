import type { CHARACTER_KEY } from "./characters"
import type { ECHO_KEY, ECHO_SET_KEY } from "./echoes"
import type { WEAPON_STAT } from "./weapons"

export type Element =
  | "aero"
  | "electro"
  | "fusion"
  | "glacio"
  | "havoc"
  | "spectro"

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
  owner: string
  // classifications?: (Element | BuffType)[]
  createdBy: string[]
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
  owner: string
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
