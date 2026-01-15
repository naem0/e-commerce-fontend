import { categoryService, brandService } from "@/services/api"
import ProductsList from "@/components/product/products-list"

export const metadata = {
  title: "All Products - E-Commerce",
  description: "Browse our complete collection of products",
}

export default async function ProductsPage() {
  // Fetch initial data server-side
  let categories = []
  let brands = []

  try {
    const [categoriesResponse, brandsResponse] = await Promise.all([
      categoryService.getCategories(),
      brandService.getBrands(),
    ])

    if (categoriesResponse.success) {
      categories = categoriesResponse.categories
    }

    if (brandsResponse.success) {
      brands = brandsResponse.brands
    }
  } catch (error) {
    console.error("Error fetching initial data:", error)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Products</h1>
      <ProductsList initialCategories={categories} initialBrands={brands} />
    </div>
  )
}
