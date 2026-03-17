import type { BONUSSTAT_KEY, CHARACTER_KEY } from "./characters"
import type { ECHO_KEY, ECHO_SET_KEY } from "./echoes"
import type { WEAPON_KEY, WEAPON_STAT } from "./weapons"

export const ELEMENT = [
  "aero",
  "electro",
  "fusion",
  "glacio",
  "havoc",
  "spectro",
] as const
export type ELEMENT_KEY = (typeof ELEMENT)[number]

export const SKILL_CATEGORY = [
  "basic",
  "forte",
  "intro",
  "heavy",
  "liberation",
  "outro",
  "skill",
] as const
export type SKILL_CATEGORY_KEY = (typeof SKILL_CATEGORY)[number]

export type BUFF_CATEGORY_KEY = Omit<
  SKILL_CATEGORY_KEY,
  "forte" | "intro" | "outro"
>

export const BUFF_TYPE_KEYS = [
  // stats
  "atk",
  "def",
  "hp",
  "er",
  "crit",
  "critDmg",
  // category bonuses
  "basic",
  "heavy",
  "skill",
  "liberation",
  "all",
  // elemental bonuses
  "aero",
  "electro",
  "fusion",
  "glacio",
  "havoc",
  "spectro",
  // category deepen
  "baDeep",
  "heDeep",
  "skDeep",
  "liDeep",
  "allDeep",
  // elemental deepen
  "aeDeep",
  "elDeep",
  "fuDeep",
  "glDeep",
  "haDeep",
  "spDeep",
  // skill specific
  "bonus",
  "amp",
  "multiplier",
  // special
  "resIgnore",
  "defIgnore",
  "erMulti",
  "foMulti",
  "heal",
  "allEle",
  "physical",
  // dCond
  "forte",
  "forte2",
  "concerto",
  "resonance",
  // rest
  "intro",
  "outro",
] as const
export type BUFF_TYPE = (typeof BUFF_TYPE_KEYS)[number]

export const BUFF_CATEGORY_KEYS = [
  "Buff",
  "BuffBonus",
  "BuffConsume",
  "BuffDCondFlat",
  "BuffNext",
  "BuffStacking",
  "BuffOffField",
  "Damage",
  "Mode",
] as const

export type BUFF_CATEGORY = (typeof BUFF_CATEGORY_KEYS)[number]

type ModifierValue = {
  class: BUFF_TYPE
  value: number
  stackValue?: number
  forte?: number
  forte2?: number
  concerto?: number
  resonance?: number
}

export type BuffObject = {
  id: string
  name: string
  type: BUFF_CATEGORY
  source: CHARACTER_KEY | "Self"
  classifications?: (ELEMENT_KEY | SKILL_CATEGORY_KEY | "echo")[] // For damage proc's
  triggeredBy?: (string | SKILL_CATEGORY_KEY | "echo")[]
  appliesTo: CHARACTER_KEY | "Self" | "Next"
  modifiers: ModifierValue[]
  consumedBy?: string[]
  duration: number
  cooldown?: number
  stackLimit?: number
  stackInterval?: number
  sequenceReq?: number
}
export type WeaponBuffObject = Omit<
  BuffObject,
  "consumedBy" | "sequenceReq" | "forte" | "forte2" | "concerto" | "resonance"
>

export type ActiveBuffObject = {
  stackCount?: number
  endTime: number
} & BuffObject

type EventValues = {
  frame: number
  mv: number
  forte: number
  forte2: number
  concerto: number
  resonance: number
  scaling: "def" | "hp" // default to atk
  heal: number
}

type SkillVariation = {
  frames?: number // in frames
  hits?: Partial<EventValues>[]
}

export type SKILL = {
  id: string
  name: string
  category: SKILL_CATEGORY_KEY | "echo"
  classifications: (ELEMENT_KEY | SKILL_CATEGORY_KEY | "echo")[]
  frames: number // in frames
  freezetime?: number
  cooldown?: number
  onCast?: Partial<EventValues>
  hits: Partial<EventValues>[]
  variations?: Record<string, SkillVariation>
}

export type Skill = Omit<SKILL, "hits" | "variations"> & {
  mv: number
  hits: number
  forte: number
  forte2: number
  concerto: number
  resonance: number
}

export type Echo = SKILL & { set: string }

type SkillSequence = {
  1: SKILL | null
} & Record<number, SKILL | null>

type SkillCategory = Record<SKILL_CATEGORY_KEY, SkillSequence>

export interface CharacterSkills {
  [char: string]: SkillCategory
}

export type ActionListItem = {
  char: CHARACTER_KEY
  skill: SKILL
  time: number
}

export type TimelineItem = {
  char: CHARACTER_KEY
  type: "parent" | "hit"
  skill: Skill
  time: number
  parent?: string
}

export type Result = {
  row: number
  char: string
  type: "parent" | "hit"
  skill: Skill
  time: number
  concerto: number
  resonance: number
  damage: number
  proc: Proc
  parent?: string
  buffs: string[]
  buffMap: string[]
}

export type BonusStats = Record<BONUSSTAT_KEY, number>

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
  id: CHARACTER_KEY
  name: string
  sequence: number
  weaponType: string
  weapon: Weapon
  echo: ECHO_KEY
  echoSet: ECHO_SET_KEY[]
  build: string
  element: ELEMENT_KEY
  bonus1: BONUSSTAT_KEY
  bonus2: BONUSSTAT_KEY | "heal"
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

export type SETTINGS_KEY = "sequence" | "weapon" | "echoSet" | "echo"

export type TeamSlot =
  | {
      character: null
      settings: null
    }
  | {
      character: Character
      settings: CharSettings
    }

export type BuffMap = Record<BUFF_TYPE, number>

type Proc = {
  damage: number
  heal: number
  shield: number
}

export type Context = {
  activeBuffs: Record<string, ActiveBuffObject[]>
  onFieldChar: CHARACTER_KEY | ""
  allBuffs: BuffObject[]
  buffMap: Record<string, BuffMap>
  buffNext: ActiveBuffObject[]
  buffDeferred: ActiveBuffObject[]
  characters: Record<string, Character>
  hasSwapped: boolean
  prevChar: CHARACTER_KEY | ""
  proc: Proc
  row: number
  time: number
}
