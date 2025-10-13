import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getProducts } from "@/services/product.service"
import { getCategory } from "@/services/category.service"
import { ProductCard } from "@/components/product/product-card"
import { Skeleton } from "@/components/ui/skeleton"

export default async function CategoryProducts({ categoryId, title, limit = 8, design = "category-products-1" }) {
  if (!categoryId) return null

  let category = null
  let products = []
  let error = null

  try {
    const [categoryResult, productsResult] = await Promise.all([
      getCategory(categoryId),
      getProducts({ category: categoryId?._id || categoryId, limit, status: "published" }),
    ])

    if (categoryResult.success) {
      category = categoryResult.category
    }

    if (productsResult.success) {
      products = productsResult.products
    } else {
      error = productsResult.message || "Failed to fetch products"
    }
  } catch (err) {
    console.error("Error in CategoryProducts:", err)
    error = err.message
  }

  if (error) return null

  const sectionTitle = title || category?.name || "Products"

  const renderProductGrid = () => {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    )
  }

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
              <Button variant="outline">View All</Button>
            </Link>
          </div>

          {products?.length > 0 ? renderProductGrid() : <p>No products found.</p>}
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

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
