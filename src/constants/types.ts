import type { BONUSSTAT_KEY, CHARACTER_KEY } from "./characters"
import type { ECHO_KEY, ECHO_SET_KEY } from "./echoes"
import type { WEAPON_KEY, WEAPON_STAT } from "./weapons"

export const ELEMENT_KEYS = [
  "aero",
  "electro",
  "fusion",
  "glacio",
  "havoc",
  "spectro",
] as const
export type ELEMENT = (typeof ELEMENT_KEYS)[number]

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

export const DCOND_KEYS = ["forte", "forte2", "concerto", "resonance"] as const
export type DCOND_KEY = (typeof DCOND_KEYS)[number]

export const BUFF_CATEGORY_KEYS = [
  "Buff",
  "BuffAll",
  "BuffNext",
  "BuffStacking",
  "BuffToConsume",
  "Damage",
  "DCondFlat",
  "Mode"
] as const

export type BUFF_CATEGORY = (typeof BUFF_CATEGORY_KEYS)[number]

export type TriggerValue = {
  type?: "hit" // default to cast
  skill?: string[]
  category?: (SKILL_CATEGORY_KEY | "echo")[]
  condition?: string[]
}

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
  source: CHARACTER_KEY | "self"
  classifications?: (ELEMENT | SKILL_CATEGORY_KEY | "echo")[] // For damage proc's
  triggeredBy?: TriggerValue
  appliesTo: CHARACTER_KEY | "self" | "all" | "next"
  modifiers: ModifierValue[]
  consumedBy?: string[] // For mode and damage proc's
  duration: number
  cooldown?: number
  stackLimit?: number
  stackInterval?: number
  sequenceReq?: number
}
export type WeaponBuffObject = Omit<
  BuffObject,
  "consumedBy" | "sequenceReq"
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
  classifications: (ELEMENT | SKILL_CATEGORY_KEY | "echo")[]
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
  type: "cast" | "hit"
  skill: Skill
  time: number
  parent?: string
}

export type BonusStats = Record<BONUSSTAT_KEY, number>

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
  element: ELEMENT
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
  dCond: Record<DCOND_KEY, number>
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

type Message = {
  warning?: string
}

export type Context = {
  activeBuffs: Record<CHARACTER_KEY, ActiveBuffObject[]>
  activeBuffsTeam: ActiveBuffObject[]
  onFieldChar: CHARACTER_KEY | ""
  allBuffs: BuffObject[]
  buffMap: Record<CHARACTER_KEY, BuffMap>
  buffNext: ActiveBuffObject[]
  buffDeferred: ActiveBuffObject[]
  characters: Record<CHARACTER_KEY, Character>
  cooldowns: Record<string, number> // buff.id, cd
  hasSwapped: boolean
  mode : Record<CHARACTER_KEY, string[]>
  prevChar: CHARACTER_KEY | ""
  proc: Proc
  row: number
  time: number
  message: Message
}

export type Result = {
  row: number
  char: string
  type: "cast" | "hit"
  skill: Skill
  time: number
  concerto: number
  resonance: number
  damage: number
  proc: Proc
  parent?: string
  buffs: string[]
  buffsTeam: string[]
  buffMap: string[]
  message: Message
}
