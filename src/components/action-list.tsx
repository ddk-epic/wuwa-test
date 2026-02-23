import { Card, CardContent, CardTitle } from "./ui/card"

import calculate from "@/lib/calculations"
import { frameToSecond } from "@/lib/utils"

import actions from "@/constants/actions"
import team from "@/constants/characters"
import { totalBuffMap } from "@/constants/maps"

function ActionList() {
  const heading = [
    "#",
    "Character",
    "Skill",
    "Time",
    "Concerto",
    "Resonance",
    "Damage",
  ]
  const resultList = calculate(team, actions, totalBuffMap)

  return (
    <div className="flex-3">
      <Card>
        <CardContent className="px-6">
          <CardTitle>Actions</CardTitle>
          <div className="mt-6">
            {/* Header */}
            <div className="flex space-x-6">
              <span className="w-2 font-bold">{heading[0]}</span>
              <span className="w-28 font-bold">{heading[1]}</span>
              <span className="w-56 font-bold">{heading[2]}</span>
              <span className="w-18 font-bold text-right">{heading[3]}</span>
              <span className="w-18 font-bold text-right">{heading[4]}</span>
              <span className="w-18 font-bold text-right">{heading[5]}</span>
              <span className="w-22 font-bold text-right">{heading[6]}</span>
            </div>
            {resultList.map((item, idx) => {
              return (
                <div key={idx} className="flex space-x-6">
                  <span className="w-2">{item.row}</span>
                  <span className="w-28">{item.char}</span>
                  <span className="w-56">{`${item.skill.category}: ${item.skill.name}`}</span>
                  <span className="w-18 text-right">
                    {frameToSecond(item.time, 2)}
                  </span>
                  <span className="w-18 text-right">
                    {Math.round(item.concerto)}
                  </span>
                  <span className="w-18 text-right">
                    {item.resonance.toFixed(2)}
                  </span>
                  <span className="w-28 text-right pr-6">
                    {Math.round(item.damage)}
                  </span>
                  <span className="w-100 flex items-center text-xs">
                    ({item?.buffs?.length}) [{item?.buffs?.map((buff) => buff.name).join(", ")}]
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ActionList
