import type {
  BuffDefinition,
  Character,
  CHARACTER_KEY,
  SkillCategory,
} from "@/shared/types"

import encoreAbilities from "../characters/encore/abilities"
import sanhuaAbilities from "../characters/sanhua/abilities"
import shorekeeperAbilities from "../characters/shorekeeper/abilities"
import verinaAbilities from "../characters/verina/abilities"

import encoreBuffs from "../characters/encore/buffs"
import sanhuaBuffs from "../characters/sanhua/buffs"
import shorekeeperBuffs from "../characters/shorekeeper/buffs"
import verinaBuffs from "../characters/verina/buffs"

import encoreData from "../characters/encore/data"
import sanhuaData from "../characters/sanhua/data"
import shorekeeperData from "../characters/shorekeeper/data"
import verinaData from "../characters/verina/data"

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

export const characterTemplate: Record<CHARACTER_KEY, Character> = {
  encore: encoreData,
  sanhua: sanhuaData,
  shorekeeper: shorekeeperData,
  verina: verinaData,
}
