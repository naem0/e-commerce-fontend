export default function SuppliersLoading() {
  return (
    <div className="container mx-auto p-6">
      <div className="animate-pulse space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="h-4 bg-gray-200 rounded w-96"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-32"></div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>

        {/* Search Card */}
        <div className="h-20 bg-gray-200 rounded"></div>

        {/* Table */}
        <div className="h-96 bg-gray-200 rounded"></div>
      </div>
    </div>
  )
}
