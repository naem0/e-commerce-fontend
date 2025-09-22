export default function Loading() {
  return (
    <div className="p-6 animate-pulse max-w-5xl mx-auto space-y-8">
      {/* Title */}
      <div className="h-8 bg-gray-300 rounded w-2/3 mx-auto" />

      <div className="flex flex-col md:flex-row gap-10">
        {/* Image */}
        <div className="w-full md:w-1/2 flex flex-col items-center space-y-4">
          <div className="w-full h-80 bg-gray-200 rounded-md" />
          <div className="flex space-x-2">
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className="w-16 h-16 bg-gray-200 rounded-md" />
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 space-y-5">
          <div className="h-6 bg-gray-300 rounded w-1/3" /> {/* Price */}
          <div className="h-4 bg-gray-300 rounded w-1/4" /> {/* Rating */}

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-full" />
            <div className="h-4 bg-gray-300 rounded w-5/6" />
            <div className="h-4 bg-gray-300 rounded w-2/3" />
          </div>

          {/* Quantity & Action */}
          <div className="flex space-x-4 mt-6">
            <div className="h-12 w-36 bg-gray-300 rounded" />
            <div className="h-12 w-36 bg-gray-300 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
