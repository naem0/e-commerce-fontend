export default function Loading() {
  return (
    <div className="p-6 animate-pulse space-y-4">
      <div className="h-6 bg-gray-300 rounded w-1/2" />
      <div className="h-4 bg-gray-300 rounded w-1/3" />
      
      <div className="w-full h-64 bg-gray-200 rounded-md" />

      <div className="space-y-2">
        <div className="h-4 bg-gray-300 rounded" />
        <div className="h-4 bg-gray-300 rounded w-5/6" />
        <div className="h-4 bg-gray-300 rounded w-2/3" />
      </div>

      <div className="flex space-x-4 mt-6">
        <div className="h-10 w-32 bg-gray-300 rounded" />
        <div className="h-10 w-32 bg-gray-300 rounded" />
      </div>
    </div>
  );
}
