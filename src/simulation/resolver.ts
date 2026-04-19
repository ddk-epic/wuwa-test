import type { BuffResolver } from "@/shared/types"

import encoreResolver from "../content/characters/encore/resolver"
import sanhuaResolver from "../content/characters/sanhua/resolver"
import shorekeeperResolver from "@/content/characters/shorekeeper/resolver"
import verinaResolver from "../content/characters/verina/resolver"

import weaponResolver from "@/content/weapons/resolver"
import echoResolver from "@/content/echoes/resolver"
import echoSetResolver from "@/content/echoes/set-resolver"

export const buffHandler: Record<string, BuffResolver> = {
  /* characters */
  ...encoreResolver,
  ...sanhuaResolver,
  ...shorekeeperResolver,
  ...verinaResolver,
  /* weapons */
  ...weaponResolver,
  /* echo */
  ...echoResolver,
  /* echo sets */
  ...echoSetResolver,
}

export default buffHandler
