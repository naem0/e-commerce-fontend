"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { useLanguage } from "@/components/language-provider"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Search, SlidersHorizontal } from "lucide-react"
import { productService, categoryService, brandService } from "@/services/api"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/components/ui/use-toast"

export default function ProductsPage() {
  const { t } = useLanguage()
  const { addToCart } = useCart()
  const { toast } = useToast()
  const searchParams = useSearchParams()

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    brand: searchParams.get("brand") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sort: searchParams.get("sort") || "newest",
  })

  const [pagination, setPagination] = useState({
    page: Number.parseInt(searchParams.get("page") || "1"),
    limit: 12,
    total: 0,
    totalPages: 0,
  })

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)

        // Prepare params
        const params = {
          page: pagination.page,
          limit: pagination.limit,
          sort: filters.sort,
        }

        // Add optional filters
        if (filters.search) params.search = filters.search
        if (filters.category) params.category = filters.category
        if (filters.brand) params.brand = filters.brand
        if (filters.minPrice) params.minPrice = filters.minPrice
        if (filters.maxPrice) params.maxPrice = filters.maxPrice

        const response = await productService.getProducts(params)

        if (response.success) {
          setProducts(response.products)
          setPagination({
            ...pagination,
            total: response.total,
            totalPages: response.totalPages,
          })
        } else {
          setError(response.message || "Failed to fetch products")
        }
      } catch (err) {
        console.error("Error fetching products:", err)
        setError("An error occurred while fetching products")
      } finally {
        setLoading(false)
      }
    }

    const fetchFilters = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await categoryService.getCategories()
        if (categoriesResponse.success) {
          setCategories(categoriesResponse.categories)
        }

        // Fetch brands
        const brandsResponse = await brandService.getBrands()
        if (brandsResponse.success) {
          setBrands(brandsResponse.brands)
        }
      } catch (err) {
        console.error("Error fetching filters:", err)
      }
    }

    fetchProducts()
    fetchFilters()
  }, [
    filters,
    filters.sort,
    filters.search,
    filters.category,
    filters.brand,
    filters.minPrice,
    filters.maxPrice,
    pagination.page,
  ])

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Reset to first page when filters change
    if (name !== "page") {
      setPagination((prev) => ({
        ...prev,
        page: 1,
      }))
    }
  }

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product._id, 1)
      toast({
        title: t("cart.added") || "Added to cart",
        description: `${product.name} ${t("cart.addedToCart") || "has been added to your cart"}`,
      })
    } catch (err) {
      toast({
        title: t("cart.error") || "Error",
        description: err.message || "Failed to add product to cart",
        variant: "destructive",
      })
    }
  }

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({
      ...prev,
      page: newPage,
    }))

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("products.allProducts") || "All Products"}</h1>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("products.search") || "Search products..."}
                className="pl-8"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder={t("products.category") || "Category"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("products.allCategories") || "All Categories"}</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.brand} onValueChange={(value) => handleFilterChange("brand", value)}>
              <SelectTrigger>
                <SelectValue placeholder={t("products.brand") || "Brand"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("products.allBrands") || "All Brands"}</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand._id} value={brand._id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.sort} onValueChange={(value) => handleFilterChange("sort", value)}>
              <SelectTrigger>
                <SelectValue placeholder={t("products.sort") || "Sort By"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t("products.newest") || "Newest"}</SelectItem>
                <SelectItem value="price_asc">{t("products.priceLowToHigh") || "Price: Low to High"}</SelectItem>
                <SelectItem value="price_desc">{t("products.priceHighToLow") || "Price: High to Low"}</SelectItem>
                <SelectItem value="name_asc">{t("products.nameAZ") || "Name: A-Z"}</SelectItem>
                <SelectItem value="name_desc">{t("products.nameZA") || "Name: Z-A"}</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              <span>{t("products.moreFilters") || "More Filters"}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-square relative">
                <Skeleton className="h-full w-full" />
              </div>
              <CardContent className="p-4">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-20 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">{t("products.noProducts") || "No products found"}</h3>
          <p className="text-muted-foreground mt-2">
            {t("products.tryDifferentFilters") || "Try different filters or search terms"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product._id} className="overflow-hidden">
              <Link href={`/products/${product._id}`}>
                <div className="aspect-square relative overflow-hidden group">
                  <Image
                    src={product.images?.[0] || "/placeholder.svg?height=300&width=300"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                  />
                  {product.discount > 0 && (
                    <Badge className="absolute top-2 left-2 bg-red-500">
                      {product.discount}% {t("products.off") || "OFF"}
                    </Badge>
                  )}
                  {product.isNew && (
                    <Badge className="absolute top-2 right-2 bg-green-500">{t("products.new") || "NEW"}</Badge>
                  )}
                </div>
              </Link>
              <CardContent className="p-4">
                <Link href={`/products/${product._id}`}>
                  <h3 className="font-medium line-clamp-1 hover:underline">{product.name}</h3>
                </Link>
                <div className="flex items-center mt-1">
                  {product.salePrice ? (
                    <>
                      <span className="font-bold">${product.salePrice.toFixed(2)}</span>
                      <span className="text-sm text-muted-foreground line-through ml-2">
                        ${product.price.toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="font-bold">${product.price.toFixed(2)}</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.shortDescription}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full" onClick={() => handleAddToCart(product)} disabled={product.stock <= 0}>
                  {product.stock <= 0 ? (
                    t("products.outOfStock") || "Out of Stock"
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      {t("product.addToCart") || "Add to Cart"}
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              disabled={pagination.page === 1}
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              {t("pagination.previous") || "Previous"}
            </Button>

            {[...Array(pagination.totalPages)].map((_, i) => {
              const page = i + 1
              // Show first, last, and pages around current page
              if (
                page === 1 ||
                page === pagination.totalPages ||
                (page >= pagination.page - 1 && page <= pagination.page + 1)
              ) {
                return (
                  <Button
                    key={page}
                    variant={pagination.page === page ? "default" : "outline"}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                )
              }
              // Show ellipsis
              if (page === 2 || page === pagination.totalPages - 1) {
                return (
                  <Button key={page} variant="outline" disabled>
                    ...
                  </Button>
                )
              }
              return null
            })}

            <Button
              variant="outline"
              disabled={pagination.page === pagination.totalPages}
              onClick={() => handlePageChange(pagination.page + 1)}
            >
              {t("pagination.next") || "Next"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
