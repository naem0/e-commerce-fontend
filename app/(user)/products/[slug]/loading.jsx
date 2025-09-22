export default function Loading() {
  return (
    <div className="p-6 animate-pulse space-y-6 container mx-auto">
      {/* Product Title */}
      <div className="h-8 bg-gray-300 rounded w-3/4" />

      {/* Product Info Section */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Image */}
        <div className="w-full md:w-1/2">
          <div className="w-full h-80 bg-gray-200 rounded-md" />
          <div className="flex space-x-2 mt-4">
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className="w-20 h-20 bg-gray-200 rounded-md" />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 space-y-4">
          {/* Price */}
          <div className="h-6 bg-gray-300 rounded w-1/4" />

          {/* Rating */}
          <div className="h-4 bg-gray-300 rounded w-1/3" />

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-full" />
            <div className="h-4 bg-gray-300 rounded w-5/6" />
            <div className="h-4 bg-gray-300 rounded w-2/3" />
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center space-x-4 mt-4">
            <div className="h-10 w-24 bg-gray-300 rounded" />
            <div className="h-10 w-36 bg-gray-300 rounded" />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mt-6">
            <div className="h-12 w-40 bg-gray-300 rounded" />
            <div className="h-12 w-40 bg-gray-300 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
