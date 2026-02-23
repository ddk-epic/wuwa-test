import { Card, CardContent, CardTitle } from "./ui/card"

import calculate from "@/lib/calculations"

import actions from "@/constants/actions"
import team from "@/constants/characters"
import { totalBuffMap } from "@/constants/maps"

function ActionDetails() {
  const resultList = calculate(team, actions, totalBuffMap)
  return (
    <div className="flex-1 min-w-0">
      <Card>
        <CardContent className="px-6">
          <CardTitle>Details</CardTitle>
          <div className="flex flex-col space-y-6">
            <div className="my-6">{JSON.stringify(resultList.map(item => item.buffs))}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ActionDetails
