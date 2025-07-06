"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { useLanguage } from "@/components/language-provider"
import { Skeleton } from "@/components/ui/skeleton"
import { getProducts } from "@/services/product.service"
import { getCategory } from "@/services/category.service"
import { ProductCard } from "@/components/product/product-card"

export function CategoryProducts({ categoryId, title, limit = 8, design = "category-products-1" }) {
  const { t } = useLanguage()
  const { addToCart } = useCart()
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!categoryId) return

      try {
        setLoading(true)

        // Fetch category info and products in parallel
        const [categoryResult, productsResult] = await Promise.all([
          getCategory(categoryId?._id || categoryId),
<<<<<<< HEAD
          getProducts({ category: categoryId?._id || categoryId, limit }),
=======
          getProducts({ category: categoryId, limit }),
>>>>>>> deb65d4920e3458694b3a9a4b2e330575dad9038
        ])

        if (categoryResult.success) {
          setCategory(categoryResult.category)
        }

        if (productsResult.success) {
          setProducts(productsResult.products)
        } else {
          throw new Error(productsResult.message || "Failed to fetch products")
        }
      } catch (err) {
        console.error("Error fetching category products:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [categoryId, limit])

  const handleAddToCart = (product) => {
    addToCart(product?._id, 1)
  }

  if (!categoryId || error) {
    return null
  }

  const sectionTitle = title || category?.name || t("products.categoryProducts")

  if (design === "category-products-2") {
    return (
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">{sectionTitle}</h2>
              {category?.description && <p className="text-muted-foreground mt-2">{category.description}</p>}
            </div>
            <Link href={`/categories/${category?.slug || categoryId}`}>
              <Button variant="outline">{t("products.viewAll") || "View All"}</Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-5 w-1/4 mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} handleAddToCart={handleAddToCart} />
              ))}
            </div>
          )}
        </div>
      </section>
    )
  }

  // Default design
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">{sectionTitle}</h2>
          {category?.description && (
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">{category.description}</p>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-5 w-1/4 mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} handleAddToCart={handleAddToCart} />
            ))}
          </div>
        )}

        {/* <div className="text-center mt-8">
          <Link href={`/categories/${category?.slug || categoryId}`}>
            <Button variant="outline">{t("products.viewAll") || "View All Products"}</Button>
          </Link>
        </div> */}
      </div>
    </section>
  )
}
