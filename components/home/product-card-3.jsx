import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Eye, Heart, ArrowLeftRight } from "lucide-react"
import StarRating from "@/components/home/star-rating"
import { useLanguage } from "../language-provider"
import { Badge } from "@/app/components/ui/badge"

const ProductCard3 = ({ product, handleAddToCart }) => {
    console.log("ProductCard3 rendered for product:", product)
    const { t } = useLanguage()
    
    return (
        <Card className="shadow-sm hover:shadow-md transition-shadow">
            <div className="card-body p-3">
                <div className="text-center position-relative">
                    {/* Sale Badge */}
                    {product.discount && (
                        <div className="position-absolute top-0 start-0">
                            <Badge className="bg-red-500">{t("products.sale") || "Sale"}</Badge>
                        </div>
                    )}
                    
                    {/* Product Image */}
                    <Link href={`/product/${product._id}`} className="block mb-3">
                        <div className="aspect-square overflow-hidden bg-gray-100 rounded">
                            <Image 
                                src={product.images?.[0] || "/placeholder.svg"}
                                alt={product.name} 
                                width={400}
                                height={400}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </Link>
                    
                    {/* Action Buttons */}
                    <div className="card-product-action flex justify-center gap-2 mt-2">
                        <Button variant="ghost" size="sm" className="rounded-full p-2 h-8 w-8">
                            <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="rounded-full p-2 h-8 w-8">
                            <Heart className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="rounded-full p-2 h-8 w-8">
                            <ArrowLeftRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                
                {/* Category */}
                <div className="text-sm mb-1">
                    <Link href="#" className="text-muted-foreground hover:text-primary">
                        {product.category?.name || "General"}
                    </Link>
                </div>
                
                {/* Product Name */}
                <h2 className="text-lg font-semibold mb-1">
                    <Link href={`/product/${product._id}`} className="hover:text-primary">
                        {product.name}
                    </Link>
                </h2>
                
                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                    <StarRating rating={product.rating} size={14} />
                    <span className="text-muted-foreground text-sm">
                        {product.rating?.toFixed(1)}({product.numReviews || 0})
                    </span>
                </div>
                
                {/* Price and Add to Cart */}
                <div className="flex justify-between items-center mt-3">
                    <div>
                        <span className="text-primary font-semibold">${product.price}</span>
                        {product.originalPrice && (
                            <span className="text-muted-foreground text-sm line-through ml-2">
                                ${product.originalPrice}
                            </span>
                        )}
                    </div>
                    
                    <Button 
                        onClick={() => handleAddToCart(product)}
                        size="sm" 
                        className="h-8"
                    >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        {t("products.add") || "Add"}
                    </Button>
                </div>
            </div>
        </Card>
    )
}

export default ProductCard3