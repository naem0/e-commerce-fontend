import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useLanguage } from "../language-provider"
import { ShoppingCart } from "lucide-react"

const ProductCard2 = ({ product, handleAddToCart }) => {
  const { t } = useLanguage();
  return (
    <Card key={product._id} className="overflow-hidden">
      <Link href={`/products/${product.slug}`}>
        <div className="relative h-48 w-full">
          <Image
            src={product.images?.[0] ? process.env.NEXT_PUBLIC_API_URL + product.images[0] : "/placeholder.svg?height=192&width=256"}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors">{product.name}</h3>
        </Link>
        <p className="text-lg font-bold mb-2">${product.price.toFixed(2)}</p>
        <Button
          onClick={(e) => { e.preventDefault(); handleAddToCart(product) }}
          className="w-full"
        >
          <ShoppingCart className="h-4 w-4" />
          {t("products.addToCart") || "Add to Cart"}
        </Button>
      </CardContent>
    </Card>
  )
}

export default ProductCard2
