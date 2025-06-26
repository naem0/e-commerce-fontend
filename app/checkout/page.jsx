"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useCart } from "@/components/cart-provider"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, CreditCard, Truck, MapPin, Plus, User } from "lucide-react"
import { formatPrice } from "@/services/utils"
import { createOrder } from "@/services/order.service"
import { register } from "@/services/auth.service"
import { getUserAddresses } from "@/services/user.service"

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { cart, clearCart } = useCart()
  const { t } = useLanguage()
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
  }, [session, cart.items.length, router])

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
    const subtotal = cart.items.reduce(
      (sum, item) => sum + (item.product?.salePrice || item.product?.price || 0) * item.quantity,
      0,
    )
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

      // If not logged in and wants to create account, register first
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

        userId = registerResponse.user.id

        toast({
          title: "Account Created",
          description: "Your account has been created successfully!",
        })
      }

      const { subtotal, tax, shipping, total } = calculateTotals()

      const orderData = {
        items: cart.items.map((item) => ({
          product: item.productId,
          name: item.product?.name || item.name,
          price: item.product?.salePrice || item.product?.price || item.price,
          quantity: item.quantity,
          image: item.product?.images?.[0] || "",
        })),
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
          title: t("checkout.orderPlaced") || "Order Placed Successfully!",
          description: t("checkout.orderPlacedDesc") || "Your order has been placed successfully.",
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
        title: t("checkout.error") || "Error",
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
          <h1 className="text-2xl font-bold mb-4">{t("checkout.emptyCart") || "Your cart is empty"}</h1>
          <Button onClick={() => router.push("/products")}>
            {t("checkout.continueShopping") || "Continue Shopping"}
          </Button>
        </div>
      </div>
    )
  }

  const { subtotal, tax, shipping, total } = calculateTotals()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t("checkout.title") || "Checkout"}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  {t("checkout.customerInfo") || "Customer Information"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">{t("checkout.fullName") || "Full Name"} *</Label>
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
                    <Label htmlFor="email">{t("checkout.email") || "Email"} *</Label>
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
                  <Label htmlFor="phone">{t("checkout.phone") || "Phone Number"} *</Label>
                  <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
                </div>

                {/* Create Account Option for Guest Users */}
                {!session && (
                  <div className="space-y-4 border-t pt-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="createAccount" checked={createAccount} onCheckedChange={setCreateAccount} />
                      <Label htmlFor="createAccount">
                        {t("checkout.createAccount") || "Create an account for faster checkout next time"}
                      </Label>
                    </div>

                    {createAccount && (
                      <div>
                        <Label htmlFor="password">{t("checkout.password") || "Password"} *</Label>
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
                  {t("checkout.shippingAddress") || "Shipping Address"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Saved Addresses for Logged In Users */}
                {session && addresses.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>{t("checkout.savedAddresses") || "Saved Addresses"}</Label>
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
                      <Label htmlFor="street">{t("checkout.address") || "Street Address"} *</Label>
                      <Input id="street" name="street" value={formData.street} onChange={handleInputChange} required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">{t("checkout.city") || "City"} *</Label>
                        <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
                      </div>
                      <div>
                        <Label htmlFor="state">{t("checkout.state") || "State/Division"}</Label>
                        <Input id="state" name="state" value={formData.state} onChange={handleInputChange} />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">{t("checkout.zipCode") || "ZIP Code"}</Label>
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
                  {t("checkout.paymentMethod") || "Payment Method"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={formData.paymentMethod} onValueChange={handlePaymentMethodChange}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash_on_delivery" id="cod" />
                    <Label htmlFor="cod" className="flex items-center cursor-pointer">
                      <Truck className="mr-2 h-4 w-4" />
                      {t("checkout.cashOnDelivery") || "Cash on Delivery"}
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
                <CardTitle>{t("checkout.orderNotes") || "Order Notes"}</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder={t("checkout.orderNotesPlaceholder") || "Any special instructions for your order..."}
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
              <CardTitle>{t("checkout.orderSummary") || "Order Summary"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cart Items */}
              <div className="space-y-2">
                {cart.items.map((item) => (
                  <div
                    key={`${item?.product?._id}-${item.product?.selectedVariant || "default"}`}
                    className="flex justify-between text-sm"
                  >
                    <span>
                      {item.product?.name || item.name} × {item.quantity}
                    </span>
                    <span>{formatPrice((item.product?.salePrice || item.product?.price || 0) * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <hr />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{t("checkout.subtotal") || "Subtotal"}</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("checkout.tax") || "Tax (5%)"}</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("checkout.shipping") || "Shipping"}</span>
                  <span>{shipping === 0 ? t("checkout.free") || "Free" : formatPrice(shipping)}</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold text-lg">
                  <span>{t("checkout.total") || "Total"}</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading} onClick={handleSubmit}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("checkout.placing") || "Placing Order..."}
                  </>
                ) : (
                  t("checkout.placeOrder") || "Place Order"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
