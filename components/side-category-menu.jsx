// app/components/SideCategoryMenu.jsx
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { getCategoryTree } from "@/services/category.service"
import { cn } from "@/lib/utils"

export default async function SideCategoryMenu({ className }) {
  let categories = []
  let error = null

  try {
    const result = await getCategoryTree({ status: "active" })
    categories = result.categories
  } catch (err) {
    error = err.message
  }

  if (error) {
    return (
      <div className={cn("bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4", className)}>
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className={cn("bg-white dark:bg-gray-900 border shadow-sm", className)}>
      <ul className="divide-y divide-gray-100 dark:divide-gray-800">
        {categories.map((category) => (
          <li key={category._id} className="relative group">
            <Link
              href={`/categories/${category.slug}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                {category.icon ? (
                  <span className="text-gray-500">{category.icon}</span>
                ) : (
                  <div className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full">
                    <span className="text-xs text-gray-500">
                      {category.name.charAt(0)}
                    </span>
                  </div>
                )}
                <span className="text-sm font-medium">{category.name}</span>
              </div>
              {category.children && category.children.length > 0 && (
                <ChevronRight className="h-4 w-4 text-gray-400" />
              )}
            </Link>

            {/* Hover dropdown for child categories */}
            {category.children && category.children.length > 0 && (
              <div className="absolute left-full top-0 min-w-[200px] bg-white dark:bg-gray-900 border shadow-md rounded-r-lg hidden group-hover:block z-10">
                <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                  {category.children.map((subCategory) => (
                    <li key={subCategory._id}>
                      <Link
                        href={`/categories/${subCategory.slug}`}
                        className="block px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        {subCategory.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}