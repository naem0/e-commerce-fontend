"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useCart } from "@/components/cart-provider"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react"

export default function CartPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { t } = useLanguage()
  const { cart, removeFromCart, updateCartItemQuantity } = useCart()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState(null)

  const handleQuantityChange = async (item, newQuantity) => {
    if (newQuantity < 1) return

    try {
      setUpdating(true)
      console.log("Updating quantity:", { item, newQuantity })

      // Use the correct item identifier
      const itemId = item._id || item.product._id
      await updateCartItemQuantity(itemId, newQuantity, item.variation)

      toast({
        title: t("cart.updated") || "Cart Updated",
        description: t("cart.quantityUpdated") || "Item quantity has been updated",
      })
    } catch (err) {
      console.error("Error updating quantity:", err)
      toast({
        title: t("cart.updateError") || "Error",
        description: err.message || "Failed to update cart",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  const handleRemoveItem = async (item) => {
    try {
      setUpdating(true)
      console.log("Removing item:", item)

      // Use the correct item identifier
      const itemId = item._id || item.product._id
      await removeFromCart(itemId, item.variation)

      toast({
        title: t("cart.removed") || "Item Removed",
        description: t("cart.itemRemoved") || "Item has been removed from your cart",
      })
    } catch (err) {
      console.error("Error removing item:", err)
      toast({
        title: t("cart.removeError") || "Error",
        description: err.message || "Failed to remove item from cart",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  const calculateSubtotal = () => {
    return (
      cart?.items.reduce((total, item) => {
        const price = item.product.salePrice || item.product.price
        return total + price * item.quantity
      }, 0) || 0
    )
  }

  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`
  }

  const handleCheckout = () => {
    router.push("/checkout")
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="mx-auto max-w-3xl">
          <CardHeader className="text-center">
            <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
            <CardTitle className="mt-4 text-2xl">{t("cart.empty") || "Your cart is empty"}</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            <p>{t("cart.emptyMessage") || "Looks like you haven't added any products to your cart yet."}</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/products">{t("cart.continueShopping") || "Continue Shopping"}</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("cart.title") || "Shopping Cart"}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("cart.items") || "Cart Items"}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {cart.items.map((item, index) => (
                  <div key={`${item.product._id}-${index}`} className="flex py-4 px-6">
                    <div className="relative h-24 w-24 rounded-md overflow-hidden">
                      <Image
                        src={item.product.images?.[0] || "/placeholder.svg?height=96&width=96"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">
                            <Link href={`/products/${item.product._id}`} className="hover:underline">
                              {item.product.name}
                            </Link>
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {item.product.salePrice
                              ? `${formatPrice(item.product.salePrice)} (${formatPrice(item.product.price)})`
                              : formatPrice(item.product.price)}
                          </p>
                          {item.variation && (
                            <p className="text-xs text-muted-foreground">
                              {Object.entries(item.variation)
                                .map(([key, value]) => `${key}: ${value}`)
                                .join(", ")}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleRemoveItem(item)}
                          disabled={updating}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">{t("cart.remove") || "Remove"}</span>
                        </Button>
                      </div>
                      <div className="mt-2 flex items-center">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleQuantityChange(item, item.quantity - 1)}
                            disabled={item.quantity <= 1 || updating}
                            className="h-8 w-8"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleQuantityChange(item, item.quantity + 1)}
                            disabled={item.quantity >= (item.product.stock || 10) || updating}
                            className="h-8 w-8"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="ml-auto font-medium">
                          {formatPrice((item.product.salePrice || item.product.price) * item.quantity)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/products">{t("cart.continueShopping") || "Continue Shopping"}</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>{t("cart.summary") || "Order Summary"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>{t("cart.subtotal") || "Subtotal"}</span>
                  <span>{formatPrice(calculateSubtotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("cart.shipping") || "Shipping"}</span>
                  <span>{t("cart.calculatedAtCheckout") || "Calculated at checkout"}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("cart.tax") || "Tax"}</span>
                  <span>{t("cart.calculatedAtCheckout") || "Calculated at checkout"}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium text-lg">
                  <span>{t("cart.total") || "Total"}</span>
                  <span>{formatPrice(calculateSubtotal())}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleCheckout} disabled={updating}>
                {t("cart.proceedToCheckout") || "Proceed to Checkout"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
