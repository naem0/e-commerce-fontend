import { Clock, Flame, Star, TrendingUp } from "lucide-react"
import { getProducts } from "@/services/product.service"
import { ProductCard } from "@/components/product/product-card"
import { Badge } from "@/components/ui/badge"
import CountdownTimer from "@/components/ui/countdown-timer"

export default async function CustomSection({ section }) {
  if (!section?.enabled) return null

  let products = []
  let error = null

  try {
    switch (section.type) {
      case "best-sellers":
        products = (await getProducts({ sortBy: "sales", limit: section.settings.limit || 8 })).products || []
        break
      case "flash-sale":
        products = (await getProducts({ onSale: true, limit: section.settings.limit || 8 })).products || []
        break
      case "category-best-sellers":
        if (section.settings.categoryId) {
          products = (
            await getProducts({
              category: section.settings.categoryId,
              sortBy: "sales",
              limit: section.settings.limit || 8,
            })
          ).products || []
        }
        break
      case "new-arrivals":
        products = (await getProducts({ sortBy: "newest", limit: section.settings.limit || 8 })).products || []
        break
      case "trending":
        products = (await getProducts({ sortBy: "popularity", limit: section.settings.limit || 8 })).products || []
        break
      case "custom-products":
        if (section.settings.productIds?.length > 0) {
          products = (await getProducts({ ids: section.settings.productIds })).products || []
        }
        break
      default:
        products = (await getProducts({ limit: section.settings.limit || 8 })).products || []
    }
  } catch (err) {
    console.error("Server error fetching products:", err)
    error = err.message || "Failed to fetch products"
  }

  const backgroundColor =
    section.settings?.backgroundColor && section.settings.backgroundColor !== "#ffffff"
      ? section.settings.backgroundColor
      : "transparent"

  const textColor = section.settings?.textColor || "inherit"

  const sectionIcon = {
    "best-sellers": <Star className="w-6 h-6" />,
    "flash-sale": <Flame className="w-6 h-6" />,
    "new-arrivals": <Clock className="w-6 h-6" />,
    trending: <TrendingUp className="w-6 h-6" />,
  }[section.type]

  const sectionBadge = {
    "best-sellers": <Badge variant="secondary">Best Sellers</Badge>,
    "flash-sale": <Badge variant="destructive">Flash Sale</Badge>,
    "new-arrivals": <Badge variant="outline">New Arrivals</Badge>,
    trending: <Badge variant="default">Trending</Badge>,
  }[section.type]

  return (
    <section className="py-12" style={{ backgroundColor, color: textColor }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            {sectionIcon}
            <h2 className="text-2xl md:text-3xl font-bold">{section.title}</h2>
            {sectionBadge}
          </div>
          {/* if Flash Sale show countdown timer */}
          {section.settings.showTimer && section.settings.endDate && (
            <div className="font-bold text-lg">
              <p className="text-sm font-light">Hurry up! Flash sale ends in:</p>
              <CountdownTimer endDate={section.settings.endDate} />
            </div>
          )}
        </div>

        {error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No products found for this section.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
