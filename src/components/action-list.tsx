import { Card, CardContent, CardTitle } from './ui/card'

function ActionList() {
  return (
    <div className="flex-3">
      <Card>
        <CardContent className="px-6">
          <CardTitle>Actions</CardTitle>
          <div className="mt-6">Content</div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ActionList
