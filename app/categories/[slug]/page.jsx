"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { getCategoryBySlug } from "@/services/category.service"
import { getProducts } from "@/services/product.service"
import { ProductCard } from "@/components/product/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Search, Filter } from "lucide-react"
import Image from "next/image"

export default function CategoryPage() {
  const { slug } = useParams()
  const { toast } = useToast()
  const [category, setCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [productsLoading, setProductsLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true)
        const response = await getCategoryBySlug(slug)
        if (response.success) {
          setCategory(response.category)
        } else {
          setError(response.message || "Category not found")
        }
      } catch (error) {
        console.error("Error fetching category:", error)
        setError(error.message || "Failed to load category")
        toast({
          title: "Error",
          description: "Failed to load category",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchCategory()
    }
  }, [slug, toast])

  useEffect(() => {
    const fetchProducts = async () => {
      if (!category) return

      try {
        setProductsLoading(true)
        const response = await getProducts({
          category: category._id,
          search: searchTerm,
          sortBy,
          sortOrder,
          page: currentPage,
          limit: 12,
        })

        if (response.success) {
          setProducts(response.products)
          setTotalPages(response.pages)
          setTotalProducts(response.total)
        } else {
          setError(response.message || "Failed to load products")
        }
      } catch (error) {
        console.error("Error fetching products:", error)
        setError(error.message || "Failed to load products")
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive",
        })
      } finally {
        setProductsLoading(false)
      }
    }

    fetchProducts()
  }, [category, searchTerm, sortBy, sortOrder, currentPage, toast])

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  const handleSortChange = (value) => {
    const [field, order] = value.split("-")
    setSortBy(field)
    setSortOrder(order)
    setCurrentPage(1)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
          <p className="text-gray-600">The category you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {category.image && (
            <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden">
              <Image
                src={category.image ? process.env.NEXT_PUBLIC_API_URL + category.image : "/placeholder.svg"}
                alt={category.name}
                className="w-full h-full object-cover"
                width={1920}
                height={1080}
              />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{category.name}</h1>
            {category.description && (
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">{category.description}</p>
            )}
            <p className="text-sm text-gray-500">{totalProducts} products found</p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" variant="outline">
            <Filter className="w-4 h-4" />
          </Button>
        </form>

        <Select value={`${sortBy}-${sortOrder}`} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name-asc">Name A-Z</SelectItem>
            <SelectItem value="name-desc">Name Z-A</SelectItem>
            <SelectItem value="price-asc">Price Low-High</SelectItem>
            <SelectItem value="price-desc">Price High-Low</SelectItem>
            <SelectItem value="createdAt-desc">Newest First</SelectItem>
            <SelectItem value="createdAt-asc">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      {productsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              <span className="px-4 py-2">
                Page {currentPage} of {totalPages}
              </span>

              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No products found</h3>
          <p className="text-gray-600">
            {searchTerm
              ? "Try adjusting your search terms"
              : "This category doesn't have any products yet"}
          </p>
        </div>
      )}
    </div>
  )
}
