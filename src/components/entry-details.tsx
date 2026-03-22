function EntryDetails() {
  return (
    <aside className="w-72 h-full flex flex-col shrink-0 bg-card border opacity-85 overflow-hidden">
      <div className="px-3 py-2 border-b">
        <p className="text-xs column-header">Details</p>
      </div>
      {/* Details */}
      <div className="flex-1 p-1.5 pr-px overflow-y-auto [scrollbar-gutter:stable]">
        Content
      </div>
    </aside>
  )
}

export default EntryDetails
