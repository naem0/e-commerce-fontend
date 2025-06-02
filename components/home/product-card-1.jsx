import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import StarRating from "@/components/home/star-rating"
import { useLanguage } from "../language-provider"
import { Badge } from "@/app/components/ui/badge"

const ProductCard1 = ({ product, handleAddToCart }) => {
    const { t } = useLanguage()
    return (
        <Card key={product.id} className="overflow-hidden group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <Link href={`/product/${product._id}`}>
                <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <Image 
                        src={product.images?.[0] || "/placeholder.svg?height=192&width=256"}
                        alt={product.name} 
                        width={400}
                        height={400}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                </div>
            </Link>
            
            <CardContent className="p-4">
                <Link href={`#`} className="hover:underline">
                    <Badge
                        variant="secondary"
                        className="mb-2"
                    >
                        {product.category?.name || "General"}
                    </Badge>
                </Link>
                <Link href={`/product/${product.id}`} className="hover:underline">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">{product.name}</h3>
                </Link>
                
                <div className="mt-1 flex items-center justify-between">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">${product.price}</span>
                    <StarRating rating={product.rating} size={14} />
                </div>
                
                <Button 
                    onClick={(e) => { e.preventDefault(); handleAddToCart(product) }}
                    size="sm" 
                    className="mt-3 w-full "
                >
                    <ShoppingCart className="h-4 w-4" />
                    {t("products.addToCart") || "Add to Cart"}
                </Button>
            </CardContent>
        </Card>
    )
}

export default ProductCard1
