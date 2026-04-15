import {
  CHARACTERS,
  SKILL_CATEGORY,
  type BASE_STATS,
  type BONUSSTAT_KEYS,
  type BUFF_TYPE_KEYS,
  type CATEGORY_KEYS,
  type DCOND_KEYS,
  type DEEPEN_KEYS,
  type ECHO,
  type ECHO_SET,
  type ELEMENT_KEYS,
  type VARIANT,
  type WEAPON_STATS,
  type WEAPONS,
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
  ability?: string[]
  category?: (SKILL_CATEGORY_KEY | "echo")[]
  condition?: string[]
  secondary?: ("heal" | "shield")[] // secondary effects
  stacksToAdd?: number
}

export type EventType = "cast" | "hit" | "damage" | "coord" | "heal" | "shield"

export type ModifierValue = {
  type?: EventType
  class: BUFF_TYPE
  statReq?: BASE_STAT
  frame?: number
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
  appliesTo?: CHARACTER_KEY | "all" | "current" | "enemy"
  modifiers?: ModifierValue[]
  // consumedBy?: string[] // For mode and damage proc's
  duration: number
  cooldown?: number
  stackLimit?: number
  stackInterval?: number
  sequenceReq?: number
}
export type WeaponBuffDefinition = Omit<BuffDefinition, "sequenceReq">

export type BuffInstance = {
  stacks?: number
  endTime: number
  usesLeft: number
  sourceEventId: string
} & BuffDefinition

type EventValue = {
  frame: number
  mv: number
  forte: number
  forte2: number
  concerto: number
  resonance: number
  scaling: "def" | "hp" // default to atk
  heal: number
  flat: number
}

type SkillVariation = {
  frames?: number // in frames
  hits?: Partial<EventValue>[]
}

export type SKILL = {
  id: string
  name: string
  category: SKILL_CATEGORY_KEY | "echo"
  classifications: BUFF_TYPE[]
  frames: number // in frames
  freezetime?: number
  cooldown?: number
  onCast?: Partial<EventValue>
  hits: Partial<EventValue>[]
  variations?: Partial<Record<variant, SkillVariation>>
}

export type Skill = Omit<SKILL, "hits" | "variations"> & {
  mv: number
  forte: number
  forte2: number
  concerto: number
  resonance: number
  scaling?: "def" | "hp" // default to atk
  heal?: number
  flat?: number
}

export type Echo = SKILL & { set: string }

export type SkillSequence = {
  1: SKILL | null // 1 always exists
} & Record<number, SKILL | null>

export type SkillCategory = Record<SKILL_CATEGORY_KEY, SkillSequence>
export type Skills = Record<CHARACTER_KEY, SkillCategory>

export type Action = {
  characterId: CHARACTER_KEY
  skill: SKILL
  time: number
}

export type TimelineEvent = {
  id: string
  characterId: CHARACTER_KEY
  type: EventType
  skill: Skill
  time: number
  sourceEventId?: string
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
  heal: number
  shield: number
}

type Message = {
  warning: Map<string, string>
}

export type StateContext = {
  action: Omit<TimelineEvent, "time">
  activeBuffs: Map<CHARACTER_KEY, Map<string, BuffInstance>>
  activeBuffsGlobal: Map<string, BuffInstance>
  activeBuffsEnemy: Map<string, BuffInstance>
  buffNext: Set<string>
  buffDeferred: Map<string, BuffDefinition>
  characters: Map<CHARACTER_KEY, Character>
  statMap: Map<CHARACTER_KEY, StatMap>
  cooldowns: Map<string, number> // buff.id, cd
  onFieldChar: CHARACTER_KEY | ""
  prevChar: CHARACTER_KEY | ""
  procQueue: TimelineEvent[]
  proc: Proc
  row: number
  time: number
  message: Message
}

export type BuffResolver = {
  id: string
  triggerRules: ((state: StateContext, buff: BuffDefinition) => boolean)[]
  expireRules?: ((state: StateContext, buff: BuffInstance) => boolean)[]
  onTrigger: (state: StateContext, buff: BuffDefinition) => StateContext
  onSwap?: (state: StateContext, buff: BuffDefinition) => StateContext
  onCast?: (state: StateContext, buff: BuffInstance) => StateContext
  onHit?: (state: StateContext, buff: BuffInstance) => StateContext
  onExpire?: (state: StateContext, buff: BuffInstance) => StateContext
}

export type Result = {
  id: string
  row: number
  characterId: string
  type: EventType
  skill: Skill
  time: number
  forte: number
  concerto: number
  resonance: number
  damage: number
  proc: Proc
  sourceEventId?: string
  buffs: string[]
  buffsGlobal: string[]
  buffsEnemy: string[]
  statMap: StatMap
  message: Message
}
