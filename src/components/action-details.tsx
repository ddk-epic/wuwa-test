import { Card, CardContent, CardTitle } from './ui/card'

function ActionDetails() {
  return (
    <div className="flex-1">
      <Card>
        <CardContent className="px-6">
          <CardTitle>Details</CardTitle>
          <div className="mt-6">Content</div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ActionDetails
