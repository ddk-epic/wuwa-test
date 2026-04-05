import type { BuffResolver } from "@/shared/types"
import encoreResolver from "./encore"
import sanhuaResolver from "./sanhua"

export const buffHandler: Record<string, BuffResolver> = {
  ...encoreResolver,
  ...sanhuaResolver,
}

export default buffHandler