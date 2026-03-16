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
  | "Mode"

type ModifierValue = {
  class: BuffType
  value: number
  stackValue?: number
}

export type BuffObject = {
  id: string
  name: string
  type: BuffCategory
  source: CHARACTER_KEY | "Self"
  // classifications?: (Element | BuffType)[]
  triggeredBy?: (string | SKILL_CATEGORY_KEY | "echo")[]
  appliesTo: CHARACTER_KEY | "Self" | "Next"
  modifiers: ModifierValue[]
  consumedBy?: string[]
  stackLimit?: number
  stackInterval?: number
  sequenceReq?: number
  duration: number
  forte?: number
  forte2?: number
  concerto?: number
  resonance?: number
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
  procc: Procc
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

export type BuffMap = Record<BuffType, number>

type Procc = {
  damage: number
  heal: number
  shield: number
}

export type Context = {
  activeBuffs: Record<string, ActiveBuffObject[]>
  onFieldCharacter: string
  allBuffs: BuffObject[]
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
