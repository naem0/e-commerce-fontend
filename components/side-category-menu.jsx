// app/components/SideCategoryMenu.jsx (Server Component)

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { getCategories } from "@/services/category.service"
import { cn } from "@/lib/utils"

export default async function SideCategoryMenu({ className }) {
  try {
    const result = await getCategories({ limit: 50, populate: "icon" })

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch categories")
    }

    // Process categories into nested structure
    const categoriesWithChildren = result.categories.map((cat) => ({
      ...cat,
      children: result.categories.filter((c) => c.parentId === cat._id),
    }))
    const topLevelCategories = categoriesWithChildren.filter((cat) => !cat.parentId)

    return (
      <div className={cn("bg-white dark:bg-gray-900 border shadow-sm", className)}>
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {topLevelCategories.map((category) => (
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
                      <span className="text-xs text-gray-500">{category.name.charAt(0)}</span>
                    </div>
                  )}
                  <span className="text-sm font-medium">{category.name}</span>
                </div>
                {category.children && category.children.length > 0 && (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
              </Link>

              {/* Always-rendered submenus (no interactivity) */}
              {category.children && category.children.length > 0 && (
                <div className="ml-6 mt-2">
                  <ul className="space-y-1">
                    {category.children.map((subCategory) => (
                      <li key={subCategory._id}>
                        <Link
                          href={`/categories/${subCategory.slug}`}
                          className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
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
  } catch (error) {
    return (
      <div className={cn("bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4", className)}>
        <p className="text-red-500">Failed to load categories</p>
      </div>
    )
  }
}
