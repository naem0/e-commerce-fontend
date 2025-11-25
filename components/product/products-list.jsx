"use client"

import { useState, useEffect, useCallback } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product/product-card"
import ProductFilters from "@/components/product/product-filters"
import { productService } from "@/services/api"

export default function ProductsList({ initialCategories, initialBrands }) {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const [filters, setFilters] = useState({
        search: "",
        category: "",
        brand: "",
        sort: "newest",
    })

    const [pagination, setPagination] = useState({
        page: 1,
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
                }

                // Convert sort format from "field_order" to sortBy and sortOrder
                if (filters.sort) {
                    const sortParts = filters.sort.split("_")
                    if (sortParts.length === 2) {
                        params.sortBy = sortParts[0] === "price" || sortParts[0] === "name" ? sortParts[0] : "createdAt"
                        params.sortOrder = sortParts[1] === "asc" || sortParts[1] === "desc" ? sortParts[1] : "desc"
                    } else if (filters.sort === "newest") {
                        params.sortBy = "createdAt"
                        params.sortOrder = "desc"
                    }
                }

                // Add optional filters
                if (filters.search) params.search = filters.search
                if (filters.category) params.category = filters.category
                if (filters.brand) params.brand = filters.brand

                const response = await productService.getProducts(params)

                if (response.success) {
                    setProducts(response.products)
                    setPagination({
                        ...pagination,
                        total: response.pagination.totalItems,
                        totalPages: response.pagination.totalPages,
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

        fetchProducts()
    }, [filters, pagination.page])

    const handleFilterChange = useCallback((newFilters) => {
        setFilters(newFilters)
        // Reset to first page when filters change
        setPagination((prev) => ({
            ...prev,
            page: 1,
        }))
    }, [])

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
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                <p>{error}</p>
            </div>
        )
    }

    return (
        <>
            <ProductFilters
                categories={initialCategories}
                brands={initialBrands}
                onFilterChange={handleFilterChange}
            />

            {/* Products Grid */}
            {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
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
                    <h3 className="text-lg font-medium">No products found</h3>
                    <p className="text-muted-foreground mt-2">
                        Try different filters or search terms
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
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
                            Previous
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
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </>
    )
}
