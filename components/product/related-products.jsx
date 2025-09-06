
"use client"

import { useState, useEffect } from "react"
import { getProducts } from "@/services/product.service"
import ProductCard from "./product-card"

export default function RelatedProducts({ categoryId, currentProductId }) {
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!categoryId) return

      try {
        setLoading(true)
        const response = await getProducts({
          category: categoryId,
          limit: 5, // Fetch 5 related products
        })

        if (response.success) {
          // Filter out the current product
          const filteredProducts = response.products.filter(
            (product) => product._id !== currentProductId
          )
          setRelatedProducts(filteredProducts.slice(0, 4)) // Show up to 4
        }
      } catch (error) {
        console.error("Error fetching related products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRelatedProducts()
  }, [categoryId, currentProductId])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="bg-gray-200 h-48 w-full animate-pulse rounded-md"></div>
            <div className="mt-4 h-6 bg-gray-200 w-3/4 animate-pulse rounded-md"></div>
            <div className="mt-2 h-8 bg-gray-200 w-1/2 animate-pulse rounded-md"></div>
          </div>
        ))}
      </div>
    )
  }

  if (relatedProducts.length === 0) {
    return null // Don't show anything if no related products
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Related Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  )
}
