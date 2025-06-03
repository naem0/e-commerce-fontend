"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { getCategories } from "@/services/category.service"
import { cn } from "@/lib/utils"

export function SideCategoryMenu({ className }) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const result = await getCategories()
        if (result.success) {
          // Process categories to create a hierarchical structure
          const categoriesWithChildren = result.categories.map((cat) => ({
            ...cat,
            children: result.categories.filter((c) => c.parentId === cat._id),
          }))

          // Only get top-level categories (those without a parent)
          const topLevelCategories = categoriesWithChildren.filter((cat) => !cat.parentId)

          setCategories(topLevelCategories)
        } else {
          throw new Error(result.message || "Failed to fetch categories")
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
        setError("Failed to load categories")
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleCategoryHover = (categoryId) => {
    setActiveCategory(categoryId)
  }

  if (loading) {
    return (
      <div className={cn("bg-white rounded-lg shadow-sm p-2", className)}>
        <div className="animate-pulse space-y-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-10 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn("bg-white rounded-lg shadow-sm p-4", className)}>
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className={cn("bg-white dark:bg-gray-900 border shadow-sm", className)}>
      <ul className="divide-y divide-gray-100 dark:divide-gray-800">
        {categories.map((category) => (
          <li
            key={category._id}
            className="relative"
            onMouseEnter={() => handleCategoryHover(category._id)}
            onMouseLeave={() => handleCategoryHover(null)}
          >
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
              {category.children && category.children.length > 0 && <ChevronRight className="h-4 w-4 text-gray-400" />}
            </Link>

            {/* Submenu for desktop */}
            {category.children && category.children.length > 0 && activeCategory === category._id && (
              <div className="absolute left-full top-0 z-10 w-56 bg-white rounded-lg shadow-lg border border-gray-100 hidden md:block">
                <ul className="py-2">
                  {category.children.map((subCategory) => (
                    <li key={subCategory._id}>
                      <Link
                        href={`/categories/${subCategory.slug}`}
                        className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
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
