"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession, signIn } from "next-auth/react"
import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CreditCard, Truck, MapPin, Plus, User } from "lucide-react"
import { formatPrice } from "@/services/utils"
import { createOrder } from "@/services/order.service"
import { register } from "@/services/auth.service"
import { getUserAddresses } from "@/services/user.service"

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { cart, clearCart, getCartTotal } = useCart()
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState("")
  const [showNewAddressForm, setShowNewAddressForm] = useState(true)
  const [createAccount, setCreateAccount] = useState(false)
  const [formData, setFormData] = useState({
    // User Info
    name: "",
    email: "",
    phone: "",
    password: "",

    // Shipping Address
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Bangladesh",

    // Payment
    paymentMethod: "cash_on_delivery",

    // Notes
    notes: "",
  })

  useEffect(() => {
    if (cart.items.length === 0) {
      router.push("/cart")
      return
    }

    // Pre-fill user data if logged in
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        name: session.user.name || "",
        email: session.user.email || "",
        phone: session.user.phone || "",
      }))

      // Load user addresses
      loadUserAddresses()
    }
  }, [status, cart.items.length, router, session])

  const loadUserAddresses = async () => {
    try {
      const response = await getUserAddresses()
      if (response.success && response.addresses.length > 0) {
        setAddresses(response.addresses)
        setShowNewAddressForm(false)
        // Select first address by default
        const defaultAddress = response.addresses.find((addr) => addr.isDefault) || response.addresses[0]
        setSelectedAddressId(defaultAddress._id)

        // Fill form with selected address
        setFormData((prev) => ({
          ...prev,
          street: defaultAddress.street,
          city: defaultAddress.city,
          state: defaultAddress.state,
          zipCode: defaultAddress.zipCode,
          country: defaultAddress.country,
        }))
      }
    } catch (error) {
      console.error("Error loading addresses:", error)
    }
  }

  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId)
    const address = addresses.find((addr) => addr._id === addressId)
    if (address) {
      setFormData((prev) => ({
        ...prev,
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
      }))
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePaymentMethodChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethod: value,
    }))
  }

  const calculateTotals = () => {
    const subtotal = getCartTotal()
    const tax = subtotal * 0.05 // 5% tax
    const shipping = subtotal > 1000 ? 0 : 60 // Free shipping over 1000 BDT
    const total = subtotal + tax + shipping

    return { subtotal, tax, shipping, total }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let userId = session?.user?.id
      let userSession = session

      // If not logged in and wants to create account, register first then auto login
      if (!session && createAccount) {
        if (!formData.password) {
          throw new Error("Password is required to create account")
        }

        const registerResponse = await register({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        })

        if (!registerResponse.success) {
          throw new Error(registerResponse.message || "Failed to create account")
        }

        toast({
          title: "Account Created",
          description: "Your account has been created successfully!",
        })

        // Auto login after registration
        const loginResult = await signIn("credentials", {
          redirect: false,
          email: formData.email,
          password: formData.password,
        })

        if (loginResult?.error) {
          console.error("Auto login failed:", loginResult.error)
          // Continue as guest but show warning
          toast({
            title: "Account Created",
            description: "Account created but auto-login failed. You can login later.",
            variant: "default",
          })
        } else if (loginResult?.ok) {
          // Wait a bit for session to update
          await new Promise((resolve) => setTimeout(resolve, 1000))

          // Get fresh session
          const { getSession } = await import("next-auth/react")
          userSession = await getSession()
          userId = userSession?.user?.id || registerResponse.user._id

          console.log("Auto login successful, user ID:", userId)
          toast({
            title: "Success",
            description: "Account created and logged in successfully!",
          })
        }
      }

      const { subtotal, tax, shipping, total } = calculateTotals()

      // Prepare order items with proper product IDs
      const orderItems = cart.items.map((item) => {
        const price = item.variation ? item.variation.price : (item.product.salePrice || item.product.price)
        const image = item.variation?.image ? process.env.NEXT_PUBLIC_API_URL + item.variation.image : (item.product.images?.[0] ? process.env.NEXT_PUBLIC_API_URL + item.product.images[0] : "/placeholder.svg?height=96&width=96")

        return {
          product: item.product._id,
          name: item.product.name,
          price: price,
          quantity: item.quantity,
          image: image,
          variation: item.variation,
        }
      })

      const orderData = {
        items: orderItems,
        shippingAddress: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        paymentMethod: formData.paymentMethod,
        subtotal,
        tax,
        shippingCost: shipping,
        total,
        notes: formData.notes,
        userId: userId || null, // null for guest orders
      }

      const response = await createOrder(orderData)

      if (response.success) {
        clearCart()
        toast({
          title: "Order Placed Successfully!",
          description: "Your order has been placed successfully.",
        })

        // Redirect based on payment method
        if (formData.paymentMethod === "cash_on_delivery") {
          router.push(`/orders/${response.order._id}`)
        } else {
          router.push(`/payment/${response.order._id}`)
        }
      } else {
        throw new Error(response.message || "Failed to create order")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to place order",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Button onClick={() => router.push("/products")}>
            Continue Shopping
          </Button>
        </div>
      </div>
    )
  }

  const { subtotal, tax, shipping, total } = calculateTotals()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      disabled={!!session}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={!!session}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
                </div>

                {/* Create Account Option for Guest Users */}
                {!session && (
                  <div className="space-y-4 border-t pt-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="createAccount" checked={createAccount} onCheckedChange={setCreateAccount} />
                      <Label htmlFor="createAccount">
                        Create an account for faster checkout next time
                      </Label>
                    </div>

                    {createAccount && (
                      <div>
                        <Label htmlFor="password">Password *</Label>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required={createAccount}
                          placeholder="Enter password for your new account"
                        />
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Saved Addresses for Logged In Users */}
                {session && addresses.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Saved Addresses</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        {showNewAddressForm ? "Use Saved Address" : "Add New Address"}
                      </Button>
                    </div>

                    {!showNewAddressForm && (
                      <RadioGroup value={selectedAddressId} onValueChange={handleAddressSelect}>
                        {addresses.map((address) => (
                          <div key={address._id} className="flex items-center space-x-2">
                            <RadioGroupItem value={address._id} id={address._id} />
                            <Label htmlFor={address._id} className="flex-1 cursor-pointer">
                              <div className="p-3 border rounded-lg">
                                <div className="font-medium">{address.name || formData.name}</div>
                                <div className="text-sm text-gray-600">
                                  {address.street}, {address.city}
                                  {address.state && `, ${address.state}`}
                                  {address.zipCode && ` ${address.zipCode}`}
                                </div>
                                <div className="text-sm text-gray-600">{address.phone}</div>
                                {address.isDefault && (
                                  <div className="text-xs text-blue-600 font-medium">Default Address</div>
                                )}
                              </div>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                  </div>
                )}

                {/* Address Form */}
                {(showNewAddressForm || !session || addresses.length === 0) && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="street">Street Address *</Label>
                      <Input id="street" name="street" value={formData.street} onChange={handleInputChange} required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
                      </div>
                      <div>
                        <Label htmlFor="state">State/Division</Label>
                        <Input id="state" name="state" value={formData.state} onChange={handleInputChange} />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleInputChange} />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={formData.paymentMethod} onValueChange={handlePaymentMethodChange}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash_on_delivery" id="cod" />
                    <Label htmlFor="cod" className="flex items-center cursor-pointer">
                      <Truck className="mr-2 h-4 w-4" />
                      Cash on Delivery
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bkash" id="bkash" />
                    <Label htmlFor="bkash" className="flex items-center cursor-pointer">
                      <CreditCard className="mr-2 h-4 w-4" />
                      bKash
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nagad" id="nagad" />
                    <Label htmlFor="nagad" className="flex items-center cursor-pointer">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Nagad
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Order Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Order Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any special instructions for your order..."
                  rows={3}
                />
              </CardContent>
            </Card>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cart Items */}
              <div className="space-y-2">
                {cart.items.map((item, index) => {
                  const price = item.variation ? item.variation.price : (item.product.salePrice || item.product.price)
                  return (
                  <div
                    key={`${item?.product?._id || item?.productId || index}-${item.product?.selectedVariant || "default"}`}
                    className="flex justify-between text-sm"
                  >
                    <div className="flex-grow pr-2">
                      <span className="font-medium">{item.product?.name || item.name || "Unknown Product"}</span>
                      <span className="text-muted-foreground"> × {item.quantity}</span>
                      {item.variation && (
                            <div className="text-xs text-muted-foreground">
                              {item.variation.options.map(opt => (
                                <span key={opt.type} className="mr-2">{opt.type}: {opt.value}</span>
                              ))}
                            </div>
                          )}
                    </div>
                    <span className="font-medium">
                      {formatPrice(price * item.quantity)}
                    </span>
                  </div>
                )})}
              </div>

              <hr />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (5%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading} onClick={handleSubmit}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  "Place Order"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
