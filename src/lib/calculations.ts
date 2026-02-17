import type { ActionItem } from "@/constants/types"

import team from "@/constants/characters"

export function calculateDamage(entry: ActionItem) {
  const char = team[entry.char]
  const enemyDefenseMultiplier = 0.52

  const damage = char.attack * entry.action.mv
  const crit = Math.min(char.crit, 1)
  const critMultiplier = char.critDmg - crit + crit * char.critDmg

  const totalDamage = damage * critMultiplier * enemyDefenseMultiplier
  //console.log(damage, critMultiplier, enemyDefenseMultiplier)
  return totalDamage
}
