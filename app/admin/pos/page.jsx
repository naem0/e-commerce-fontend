"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  User,
  CreditCard,
  Calculator,
  Receipt,
  Package,
  Scan,
} from "lucide-react"
import { formatPrice } from "@/services/utils"
import { productService } from "@/services/api"
import { createSale } from "@/services/sale.service"
import BarcodeScanner from "@/components/barcode-scanner"
import Image from "next/image"

export default function POSPage() {
  const { toast } = useToast()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [cart, setCart] = useState([])
  const [customer, setCustomer] = useState({ name: "", phone: "", email: "" })
  const [discount, setDiscount] = useState(0)
  const [tax, setTax] = useState(5) // 5% tax
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [amountReceived, setAmountReceived] = useState(0)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false)
  const [currentSale, setCurrentSale] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  useEffect(() => {
    // Filter products based on search term and category
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.name.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = categoryFilter === "all" || product.category?._id === categoryFilter

      return matchesSearch && matchesCategory && product.status === "published"
    })

    setFilteredProducts(filtered)
  }, [searchTerm, categoryFilter, products])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await productService.getProducts({
        limit: 1000,
        status: "published",
        includeVariants: true,
      })

      if (response.success) {
        setProducts(response.products)
        setFilteredProducts(response.products)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const handleBarcodeScanned = async (barcode) => {
    try {
      const response = await productService.getProductByBarcode(barcode)

      if (response.success) {
        const { product, variant } = response
        addToCart(product, variant)
        toast({
          title: "Product Found",
          description: `Added ${product.name} to cart`,
        })
      } else {
        toast({
          title: "Product Not Found",
          description: "No product found with this barcode",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error scanning barcode:", error)
      toast({
        title: "Scan Error",
        description: "Failed to scan barcode",
        variant: "destructive",
      })
    }
  }

  const getProductStock = (product) => {
    if (product.hasVariations && product.variants) {
      return product.variants.reduce((sum, variant) => sum + (variant.stock || 0), 0)
    }
    return product.stock || 0
  }

  const getProductPrice = (product, selectedVariant = null) => {
    if (selectedVariant) {
      return selectedVariant.price || product.price || 0
    }
    return product.salePrice || product.price || 0
  }

  const addToCart = (product, selectedVariant = null) => {
    const productStock = selectedVariant ? selectedVariant.stock : getProductStock(product)
    const productPrice = getProductPrice(product, selectedVariant)

    // Create unique cart item ID
    const cartItemId = selectedVariant ? `${product._id}-${selectedVariant.sku}` : product._id

    const existingItem = cart.find((item) => item.cartItemId === cartItemId)

    if (existingItem) {
      if (existingItem.quantity >= productStock) {
        toast({
          title: "Stock Limit",
          description: `Only ${productStock} items available in stock`,
          variant: "destructive",
        })
        return
      }

      setCart(cart.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      if (productStock === 0) {
        toast({
          title: "Out of Stock",
          description: "This product is out of stock",
          variant: "destructive",
        })
        return
      }

      const cartItem = {
        cartItemId,
        _id: product._id,
        name: product.name,
        sku: selectedVariant ? selectedVariant.sku : product.sku,
        barcode: selectedVariant ? selectedVariant.barcode : product.barcode,
        price: productPrice,
        quantity: 1,
        stock: productStock,
        variant: selectedVariant,
        image: product.images?.[0] || null,
      }

      setCart([...cart, cartItem])
    }
  }

  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(cartItemId)
      return
    }

    const cartItem = cart.find((item) => item.cartItemId === cartItemId)
    if (newQuantity > cartItem.stock) {
      toast({
        title: "Stock Limit",
        description: `Only ${cartItem.stock} items available in stock`,
        variant: "destructive",
      })
      return
    }

    setCart(cart.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item)))
  }

  const removeFromCart = (cartItemId) => {
    setCart(cart.filter((item) => item.cartItemId !== cartItemId))
  }

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const calculateDiscount = () => {
    return (calculateSubtotal() * discount) / 100
  }

  const calculateTax = () => {
    return ((calculateSubtotal() - calculateDiscount()) * tax) / 100
  }

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount() + calculateTax()
  }

  const calculateChange = () => {
    return Math.max(0, amountReceived - calculateTotal())
  }

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to cart before checkout",
        variant: "destructive",
      })
      return
    }
    setShowPaymentModal(true)
  }

  const processSale = async () => {
    try {
      if (paymentMethod === "cash" && amountReceived < calculateTotal()) {
        toast({
          title: "Insufficient Amount",
          description: "Amount received is less than total amount",
          variant: "destructive",
        })
        return
      }

      const saleData = {
        items: cart.map((item) => ({
          _id: item._id,
          product: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          variant: item.variant,
        })),
        customer,
        subtotal: calculateSubtotal(),
        discount: calculateDiscount(),
        tax: calculateTax(),
        total: calculateTotal(),
        paymentMethod,
        amountReceived: paymentMethod === "cash" ? amountReceived : calculateTotal(),
        notes: `POS Sale - ${new Date().toLocaleString()}`,
      }

      const response = await createSale(saleData)

      if (response.success) {
        setCurrentSale(response.sale)
        setShowPaymentModal(false)
        setShowReceiptModal(true)

        // Clear cart and reset form
        setCart([])
        setCustomer({ name: "", phone: "", email: "" })
        setDiscount(0)
        setAmountReceived(0)

        // Refresh products to update stock
        fetchProducts()

        toast({
          title: "Sale Completed",
          description: "Sale has been processed successfully",
        })
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error("Error processing sale:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to process sale",
        variant: "destructive",
      })
    }
  }

  const printReceipt = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="h-screen flex">
      {/* Left Panel - Products */}
      <div className="w-1/2 p-6 border-r">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Point of Sale</h1>
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5" />
              <span className="font-medium">{cart.length} items</span>
            </div>
          </div>

          {/* Search and Category Filter */}
          <div className="space-y-2">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, SKU, barcode, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={() => setShowBarcodeScanner(true)} variant="outline" size="icon" title="Scan Barcode">
                <Scan className="h-4 w-4" />
              </Button>
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[calc(100vh-250px)] overflow-y-auto">
            {filteredProducts.map((product) => {
              const stock = getProductStock(product)
              const price = getProductPrice(product)

              return (
                <Card key={product._id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative w-12 h-12">
                        <Image
                          src={
                            product.images?.[0]
                              ? `${process.env.NEXT_PUBLIC_API_URL}${product.images[0]}`
                              : "/placeholder.svg?height=48&width=48"
                          }
                          alt={product.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
                        <p className="text-xs text-gray-500">SKU: {product.sku || "No SKU"}</p>
                        {product.barcode && <p className="text-xs text-gray-500">Barcode: {product.barcode}</p>}
                        <p className="text-xs text-gray-500">Stock: {stock}</p>
                        <p className="font-bold text-primary">{formatPrice(price)}</p>
                        {product.hasVariations && (
                          <Badge variant="secondary" className="text-xs">
                            {product.variants?.length || 0} variants
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-col space-y-1">
                        <Button size="sm" onClick={() => addToCart(product)} disabled={stock === 0}>
                          <Plus className="h-4 w-4" />
                        </Button>
                        {product.hasVariations && product.variants && (
                          <div className="space-y-1">
                            {product.variants.slice(0, 2).map((variant, index) => (
                              <Button
                                key={index}
                                size="sm"
                                variant="outline"
                                onClick={() => addToCart(product, variant)}
                                disabled={variant.stock === 0}
                                className="text-xs p-1 h-6"
                                title={`${variant.options?.map((opt) => `${opt.type}: ${opt.value}`).join(", ")} - ${variant.barcode ? `Barcode: ${variant.barcode}` : "No barcode"}`}
                              >
                                {variant.options?.map((opt) => opt.value).join(", ")}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>

      {/* Right Panel - Cart & Checkout */}
      <div className="w-1/2 p-6 flex flex-col">
        {/* Customer Info */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <User className="mr-2 h-5 w-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <Label htmlFor="customerName">Name</Label>
                <Input
                  id="customerName"
                  value={customer.name}
                  onChange={(e) => setCustomer((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Customer name"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="customerPhone">Phone</Label>
                  <Input
                    id="customerPhone"
                    value={customer.phone}
                    onChange={(e) => setCustomer((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="Phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="customerEmail">Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={customer.email}
                    onChange={(e) => setCustomer((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="Email address"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cart Items */}
        <Card className="flex-1 mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Cart Items</CardTitle>
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Package className="mx-auto h-12 w-12 mb-2" />
                <p>No items in cart</p>
                <p className="text-sm">Scan barcode or add products manually</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.cartItemId} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatPrice(item.price)} each
                        {item.sku && <span className="ml-2">SKU: {item.sku}</span>}
                        {item.barcode && <span className="ml-2">Barcode: {item.barcode}</span>}
                      </p>
                      {item.variant && (
                        <p className="text-xs text-gray-500">
                          ({item.variant.options?.map((opt) => `${opt.type}: ${opt.value}`).join(", ")})
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => removeFromCart(item.cartItemId)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="w-20 text-right">
                      <p className="font-medium text-sm">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Totals */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Calculator className="mr-2 h-5 w-5" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatPrice(calculateSubtotal())}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Discount:</span>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number.parseFloat(e.target.value) || 0)}
                    className="w-16 h-8 text-xs"
                    min="0"
                    max="100"
                  />
                  <span className="text-xs">%</span>
                  <span>-{formatPrice(calculateDiscount())}</span>
                </div>
              </div>

              <div className="flex justify-between">
                <span>Tax ({tax}%):</span>
                <span>+{formatPrice(calculateTax())}</span>
              </div>

              <div className="border-t pt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>{formatPrice(calculateTotal())}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Checkout Button */}
        <Button onClick={handleCheckout} className="w-full h-12 text-lg" disabled={cart.length === 0}>
          <CreditCard className="mr-2 h-5 w-5" />
          Checkout
        </Button>
      </div>

      {/* Barcode Scanner Modal */}
      <BarcodeScanner
        isOpen={showBarcodeScanner}
        onClose={() => setShowBarcodeScanner(false)}
        onScan={handleBarcodeScanned}
      />

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{formatPrice(calculateTotal())}</p>
              <p className="text-gray-500">Total Amount</p>
            </div>

            <div>
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="mobile_banking">Mobile Banking</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {paymentMethod === "cash" && (
              <div>
                <Label htmlFor="amountReceived">Amount Received</Label>
                <Input
                  id="amountReceived"
                  type="number"
                  step="0.01"
                  value={amountReceived}
                  onChange={(e) => setAmountReceived(Number.parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
                {amountReceived > 0 && (
                  <p className="text-sm mt-1">
                    Change: <span className="font-bold">{formatPrice(calculateChange())}</span>
                  </p>
                )}
              </div>
            )}

            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowPaymentModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={processSale} className="flex-1">
                Complete Sale
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Receipt Modal */}
      <Dialog open={showReceiptModal} onOpenChange={setShowReceiptModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Receipt className="mr-2 h-5 w-5" />
              Sale Receipt
            </DialogTitle>
          </DialogHeader>
          {currentSale && (
            <div className="space-y-4" id="receipt">
              <div className="text-center border-b pb-4">
                <h2 className="font-bold text-lg">Your Store Name</h2>
                <p className="text-sm text-gray-600">123 Main Street, City</p>
                <p className="text-sm text-gray-600">Phone: (123) 456-7890</p>
              </div>

              <div className="text-center">
                <p className="font-medium">Sale #{currentSale.saleNumber}</p>
                <p className="text-sm text-gray-600">{new Date(currentSale.saleDate).toLocaleString()}</p>
              </div>

              {currentSale.customer.name && (
                <div>
                  <p>
                    <strong>Customer:</strong> {currentSale.customer.name}
                  </p>
                  {currentSale.customer.phone && (
                    <p>
                      <strong>Phone:</strong> {currentSale.customer.phone}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-1">
                {currentSale.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      {item.name} x{item.quantity}
                      {item.variant && (
                        <div className="text-xs text-gray-500">
                          {item.variant.options?.map((opt) => `${opt.type}: ${opt.value}`).join(", ")}
                        </div>
                      )}
                    </span>
                    <span>{formatPrice(item.totalPrice || item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-2 space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatPrice(currentSale.subtotal)}</span>
                </div>
                {currentSale.discount > 0 && (
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span>-{formatPrice(currentSale.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>{formatPrice(currentSale.tax)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-1">
                  <span>Total:</span>
                  <span>{formatPrice(currentSale.total)}</span>
                </div>
              </div>

              <div className="border-t pt-2">
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="capitalize">{currentSale.paymentMethod.replace("_", " ")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount Received:</span>
                  <span>{formatPrice(currentSale.amountReceived)}</span>
                </div>
                {currentSale.change > 0 && (
                  <div className="flex justify-between">
                    <span>Change:</span>
                    <span>{formatPrice(currentSale.change)}</span>
                  </div>
                )}
              </div>

              <div className="text-center text-sm text-gray-600 border-t pt-4">
                <p>Thank you for your business!</p>
                <p>Please keep this receipt for your records</p>
              </div>
            </div>
          )}

          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setShowReceiptModal(false)} className="flex-1">
              Close
            </Button>
            <Button onClick={printReceipt} className="flex-1">
              Print Receipt
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
