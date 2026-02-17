import { Card, CardContent, CardTitle } from "./ui/card"

import actionList from "@/constants/actions"

function ActionDetails() {

  return (
    <div className="flex-1 min-w-0">
      <Card>
        <CardContent className="px-6">
          <CardTitle>Details</CardTitle>
          <div className="mt-6">{JSON.stringify(actionList)}</div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ActionDetails
