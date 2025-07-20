export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
      </div>

      {/* Filters skeleton */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-4 animate-pulse"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
      </div>

      {/* Table skeleton */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="h-6 bg-gray-200 dark rounded w-24 mb-4 animate-pulse"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex space-x-4">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
