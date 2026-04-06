import type { BuffResolver } from "@/shared/types"
import encoreResolver from "./characters/encore"
import sanhuaResolver from "./characters/sanhua"
import rectifierResolver from "./weapons/rectifier"
import swordResolver from "./weapons/sword"

export const buffHandler: Record<string, BuffResolver> = {
  // characters
  ...encoreResolver,
  ...sanhuaResolver,
  // weapons
  ...rectifierResolver,
  ...swordResolver,
}

export default buffHandler
