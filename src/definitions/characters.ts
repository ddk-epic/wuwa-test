import type {
  BuffDefinition,
  Character,
  CHARACTER_KEY,
  SkillCategory,
} from "@/shared/types"

import encoreAbilities from "../content/characters/encore/abilities"
import sanhuaAbilities from "../content/characters/sanhua/abilities"
import shorekeeperAbilities from "../content/characters/shorekeeper/abilities"
import verinaAbilities from "../content/characters/verina/abilities"

import encoreBuffs from "../content/characters/encore/buffs"
import sanhuaBuffs from "../content/characters/sanhua/buffs"
import shorekeeperBuffs from "../content/characters/shorekeeper/buffs"
import verinaBuffs from "../content/characters/verina/buffs"

import encoreData from "../content/characters/encore/data"
import sanhuaData from "../content/characters/sanhua/data"
import shorekeeperData from "../content/characters/shorekeeper/data"
import verinaData from "../content/characters/verina/data"

export const characterTemplate: Record<CHARACTER_KEY, Character> = {
  encore: encoreData,
  sanhua: sanhuaData,
  shorekeeper: shorekeeperData,
  verina: verinaData,
}

export const cAbilities: Record<CHARACTER_KEY, SkillCategory> = {
  encore: encoreAbilities,
  sanhua: sanhuaAbilities,
  shorekeeper: shorekeeperAbilities,
  verina: verinaAbilities,
}

export const cBuffs: Record<CHARACTER_KEY, BuffDefinition[]> = {
  encore: encoreBuffs,
  sanhua: sanhuaBuffs,
  shorekeeper: shorekeeperBuffs,
  verina: verinaBuffs,
}
