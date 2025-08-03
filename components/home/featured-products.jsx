import Link from "next/link"
import { getProducts } from "@/services/product.service"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import ProductCard from "../product/product-card"

export default async function FeaturedProducts() {
  let products = []
  let error = null

  try {
    const result = await getProducts({ featured: true, limit: 8 })

    if (result.success) {
      products = result.products
    } else {
      throw new Error(result.message || "Failed to fetch products")
    }
  } catch (err) {
    console.error("Error fetching products:", err)
    error = err.message.message
  }


  if (error) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">
          {"Featured Products"}
        </h2>
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          {"Featured Products"}
        </h2>

        {products.length === 0 ? (
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
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Link href="/products">
            <Button variant="outline">{"View All Products"}</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
