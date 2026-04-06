import type { BuffResolver } from "@/shared/types"
import encoreResolver from "./characters/encore"
import sanhuaResolver from "./characters/sanhua"

export const buffHandler: Record<string, BuffResolver> = {
  ...encoreResolver,
  ...sanhuaResolver,
}

export default buffHandler