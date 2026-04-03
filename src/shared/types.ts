import type {
  BASE_STATS,
  BONUSSTAT_KEYS,
  BUFF_TYPE_KEYS,
  CATEGORY_KEYS,
  CHARACTERS,
  DCOND_KEYS,
  DEEPEN_KEYS,
  ECHO,
  ECHO_SET,
  ELEMENT_KEYS,
  SKILL_CATEGORY,
  VARIANT,
  WEAPON_STATS,
  WEAPONS,
} from "@/definitions/constants"

export type CHARACTER_KEY = (typeof CHARACTERS)[number]
export type ECHO_KEY = (typeof ECHO)[number]
export type ECHO_SET_KEY = (typeof ECHO_SET)[number]
export type WEAPON_KEY = (typeof WEAPONS)[number]
export type BONUSSTAT_KEY = (typeof BONUSSTAT_KEYS)[number]
export type BASE_STAT = (typeof BASE_STATS)[number]
export type WEAPON_STAT_KEY = (typeof WEAPON_STATS)[number]
export type ELEMENT = (typeof ELEMENT_KEYS)[number]
export type SKILL_CATEGORY_KEY = (typeof SKILL_CATEGORY)[number]
export type CATEGORY = (typeof CATEGORY_KEYS)[number]
export type DEEPEN_KEY = (typeof DEEPEN_KEYS)[number]
export type BUFF_TYPE = (typeof BUFF_TYPE_KEYS)[number]
export type DCOND_KEY = (typeof DCOND_KEYS)[number]
export type variant = (typeof VARIANT)[number]

export type TriggerValue = {
  type?: "hit" // defaults to cast
  ability?: string[]
  category?: (SKILL_CATEGORY_KEY | "echo")[]
  condition?: string[]
  mode?: string[]
  stacksToAdd?: number
}

type ModifierValue = {
  class: BUFF_TYPE
  statReq?: BASE_STAT
  value: number
  flatValue?: number
  stackValue?: number
  forte?: number
  forte2?: number
  concerto?: number
  resonance?: number
}

export type BuffDefinition = {
  id: string
  name: string
  source?: CHARACTER_KEY
  classifications?: BUFF_TYPE[] // For damage proc's
  trigger?: TriggerValue
  specialTrigger?: TriggerValue
  appliesTo?: CHARACTER_KEY | "all" | "current" | "next"
  modifiers?: ModifierValue[]
  // consumedBy?: string[] // For mode and damage proc's
  duration: number
  cooldown?: number
  stackLimit?: number
  stackInterval?: number
  sequenceReq?: number
}
export type WeaponBuffDefinition = Omit<
  BuffDefinition,
  "consumedBy" | "sequenceReq"
>

export type BuffInstance = {
  stacks?: number
  endTime: number
  originId: string
} & BuffDefinition

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
  classifications: BUFF_TYPE[]
  frames: number // in frames
  freezetime?: number
  cooldown?: number
  onCast?: Partial<EventValues>
  hits: Partial<EventValues>[]
  variations?: Partial<Record<variant, SkillVariation>>
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

export interface Skills {
  [char: string]: SkillCategory
}

export type ActionListItem = {
  characterId: CHARACTER_KEY
  skill: SKILL
  time: number
}

export type TimelineEvent = {
  characterId: CHARACTER_KEY
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
  mainStat: WEAPON_STAT_KEY
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

export type TeamSlot = {
  characterId: CHARACTER_KEY
  settings: CharSettings
}

export type CharacterSkills = Record<string, SKILL[]>

export type StatMap = Record<BUFF_TYPE, number>

type Proc = {
  damage: number
  heal: number
  shield: number
}

type Message = {
  warning?: string
}

export type StateContext = {
  activeBuffs: Map<CHARACTER_KEY, Map<string, BuffInstance>>
  activeBuffsGlobal: Map<string, BuffInstance>
  buffNext: Set<string>
  buffDeferred: Set<string>
  characters: Map<CHARACTER_KEY, Character>
  statMap: Map<CHARACTER_KEY, StatMap>
  cooldowns: Map<string, number> // buff.id, cd
  onFieldChar: CHARACTER_KEY | ""
  prevChar: CHARACTER_KEY | ""
  proc: Proc
  row: number
  time: number
  message: Message
}

export type BuffResolver = {
  id: string
  onTrigger: (
    state: StateContext,
    action: TimelineEvent,
    buff: BuffDefinition,
  ) => StateContext
  onCast?: (
    state: StateContext,
    action: TimelineEvent,
    buff: BuffInstance,
  ) => StateContext
  onHit?: (
    state: StateContext,
    action: TimelineEvent,
    buff: BuffInstance,
  ) => StateContext
  onExpire?: (
    state: StateContext,
    action: TimelineEvent,
    buff: BuffInstance,
  ) => StateContext
}

export type Result = {
  row: number
  characterId: string
  type: "cast" | "hit"
  skill: Skill
  time: number
  concerto: number
  resonance: number
  damage: number
  proc: Proc
  parent?: string
  buffs: string[]
  buffsGlobal: string[]
  statMap: StatMap
  message: Message
}
