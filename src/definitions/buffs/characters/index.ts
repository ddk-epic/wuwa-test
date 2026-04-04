import type { BuffDefinition } from "@/shared/types"

import encore from "./encore"
import sanhua from "./sanhua"
import shorekeeper from "./shorekeeper"

export const buffs: Record<string, BuffDefinition[]> = {
  encore,
  sanhua,
  shorekeeper,
}
