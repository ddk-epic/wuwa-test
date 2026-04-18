import type { BuffResolver } from "@/shared/types"
import encoreResolver from "./characters/encore"
import sanhuaResolver from "./characters/sanhua"
import verinaResolver from "./characters/verina"

import rectifierResolver from "./weapons/rectifier"
import swordResolver from "./weapons/sword"

import fusionEchoResolver from "./echo/fusion"
import otherEchoResolver from "./echo/other"

import fusionSetResolver from "./echo-set/fusion"
import otherSetResolver from "./echo-set/other"
import shorekeeperResolver from "./characters/shorekeeper"

export const buffHandler: Record<string, BuffResolver> = {
  /* characters */
  ...encoreResolver,
  ...sanhuaResolver,
  ...shorekeeperResolver,
  ...verinaResolver,
  /* weapons */
  ...rectifierResolver,
  ...swordResolver,
  /* echo */
  ...fusionEchoResolver,
  ...otherEchoResolver,
  /* echo sets */
  ...fusionSetResolver,
  ...otherSetResolver,
}

export default buffHandler
