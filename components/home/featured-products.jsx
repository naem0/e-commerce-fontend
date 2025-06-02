"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { useLanguage } from "@/components/language-provider"
import { Skeleton } from "@/components/ui/skeleton"
import { getProducts } from "@/services/product.service"
import ProductCard1 from "@/components/home/product-card-1"
import ProductCard2 from "@/components/home/product-card-2"
import ProductCard3 from "@/components/home/product-card-3"

export function FeaturedProducts() {
  const { t } = useLanguage()
  const { addToCart } = useCart()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const result = await getProducts({ featured: true, limit: 8 })

        if (result.success) {
          setProducts(result.products)
        } else {
          throw new Error(result.message || "Failed to fetch products")
        }
      } catch (err) {
        console.error("Error fetching products:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleAddToCart = async (product) => {
    if (!product || !product._id) {
      console.error("Invalid product data:", product)
      return
    }
    try {
      setLoading(true)
      await addToCart(product._id, 1)
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setLoading(false)
    }
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {products.map((product) => (
              // <ProductCard1 
              //  product={product} 
              //  key={product._id} 
              //  handleAddToCart={handleAddToCart} 
              // />

              // <ProductCard2
              //   key={product._id}
              //   product={product}
              //   handleAddToCart={handleAddToCart}
              // />

              <ProductCard3
                key={product._id}
                product={product}
                handleAddToCart={handleAddToCart}
              />
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
