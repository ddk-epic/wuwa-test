import type { Character, CHARACTER_KEY } from "@/shared/types"
import encore from "./encore"
import sanhua from "./sanhua"
import shorekeeper from "./shorekeeper"
import verina from "./verina"

const characterTemplate: Record<CHARACTER_KEY, Character> = {
  encore,
  sanhua,
  shorekeeper,
  verina,
}

export default characterTemplate
