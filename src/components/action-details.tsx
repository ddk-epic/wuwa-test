import { Card, CardContent, CardTitle } from "./ui/card"

import actionList from "@/constants/actions"
import team from "@/constants/characters"

function ActionDetails() {
  return (
    <div className="flex-1 min-w-0">
      <Card>
        <CardContent className="px-6">
          <CardTitle>Details</CardTitle>
          <div className="flex flex-col space-y-6">
            <div className="my-6">{JSON.stringify(actionList)}</div>
            <div className="my-6">{JSON.stringify(team)}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ActionDetails
