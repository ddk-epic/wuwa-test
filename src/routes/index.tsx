import { createFileRoute } from '@tanstack/react-router'

// import ActionDetails from '@/components/action-details'
import ActionList from '@/components/action-list'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div className="w-full h-full flex mx-auto p-6 gap-6">
      <ActionList />
      {/* <ActionDetails /> */}
    </div>
  )
}
