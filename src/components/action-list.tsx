import { Card, CardContent, CardTitle } from "./ui/card"

import { frameToSecond } from "@/lib/utils"
import { calculateDamage } from "@/lib/calculations"

import actionList from "@/constants/actions"

function ActionList() {
  return (
    <div className="flex-3">
      <Card>
        <CardContent className="px-6">
          <CardTitle>Actions</CardTitle>
          <div className="mt-6">
            {actionList.map((item) => (
              <div className="flex space-x-6">
                <span className="w-28">{item.char}</span>
                <span className="w-40">{item.action.name}</span>
                <span className="w-28">{frameToSecond(item.time, 2)}</span>
                <span>{Math.round(calculateDamage(item))}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ActionList
