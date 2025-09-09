export default function POSLoading() {
  return (
    <div className="h-screen flex">
      {/* Left Panel Skeleton */}
      <div className="w-1/2 p-6 border-r">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Search */}
          <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel Skeleton */}
      <div className="w-1/2 p-6 flex flex-col">
        {/* Customer Info */}
        <div className="bg-white rounded-lg border p-4 mb-4">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-3"></div>
          <div className="space-y-3">
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
            <div className="grid grid-cols-2 gap-2">
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Cart */}
        <div className="bg-white rounded-lg border p-4 flex-1 mb-4">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-3"></div>
          <div className="text-center py-8">
            <div className="h-12 w-12 bg-gray-200 rounded animate-pulse mx-auto mb-2"></div>
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mx-auto"></div>
          </div>
        </div>

        {/* Totals */}
        <div className="bg-white rounded-lg border p-4 mb-4">
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-3"></div>
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Checkout Button */}
        <div className="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  )
}
