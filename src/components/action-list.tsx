import { Card, CardContent, CardTitle } from "./ui/card"

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
                <span>{(item.time/60).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ActionList
