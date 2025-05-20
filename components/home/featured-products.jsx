"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { useLanguage } from "@/components/language-provider"
import { Skeleton } from "@/components/ui/skeleton"
import { productService } from "@/services"

export function FeaturedProducts() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
  const { t } = useLanguage()
  const { addToCart } = useCart()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)



  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true)
        const data = await productService.getProducts(8)
        setProducts(data.products || [])
      } catch (err) {
        console.error("Error fetching featured products:", err)
        setError(err.message || "Failed to load featured products")
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  const handleAddToCart = (product) => {
    addToCart(product, 1)
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">{t("products.featured") || "Featured Products"}</h2>
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          {t("products.featured") || "Featured Products"}
        </h2>

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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product._id} className="overflow-hidden">
                <Link href={`/products/${product._id}`}>
                  <div className="relative h-48 w-full">
                    <Image
                      src={product.images?.[0] || "/placeholder.svg?height=192&width=256"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>
                <CardContent className="p-4">
                  <Link href={`/products/${product._id}`}>
                    <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors">{product.name}</h3>
                  </Link>
                  <p className="text-lg font-bold mb-2">${product.price.toFixed(2)}</p>
                  <Button onClick={() => handleAddToCart(product)} className="w-full">
                    {t("products.addToCart") || "Add to Cart"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Link href="/products">
            <Button variant="outline">{t("products.viewAll") || "View All Products"}</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
