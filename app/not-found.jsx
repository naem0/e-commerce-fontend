import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">The page you are looking for does not exist.</p>
      <Link href="/" className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors">
        Return to Home
      </Link>
    </div>
  )
}
