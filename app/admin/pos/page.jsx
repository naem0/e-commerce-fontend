"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Search, Plus, Minus, Trash2, ShoppingCart, User, CreditCard, Calculator, Receipt } from "lucide-react"
import { formatPrice } from "@/services/utils"

export default function POSPage() {
  const { toast } = useToast()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [cart, setCart] = useState([])
  const [customer, setCustomer] = useState({ name: "", phone: "" })
  const [discount, setDiscount] = useState(0)
  const [tax, setTax] = useState(5) // 5% tax
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [amountReceived, setAmountReceived] = useState(0)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [currentSale, setCurrentSale] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    // Filter products based on search term
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredProducts(filtered)
  }, [searchTerm, products])

  const fetchProducts = async () => {
    try {
      // Mock data - replace with actual API call
      const mockProducts = [
        {
          _id: "1",
          name: "Wireless Headphones",
          sku: "WH001",
          price: 99.99,
          stock: 25,
          category: { name: "Electronics" },
          image: "/placeholder.svg?height=60&width=60",
        },
        {
          _id: "2",
          name: "Smartphone Case",
          sku: "SC002",
          price: 19.99,
          stock: 50,
          category: { name: "Accessories" },
          image: "/placeholder.svg?height=60&width=60",
        },
        {
          _id: "3",
          name: "USB Cable",
          sku: "UC003",
          price: 9.99,
          stock: 100,
          category: { name: "Accessories" },
          image: "/placeholder.svg?height=60&width=60",
        },
        {
          _id: "4",
          name: "Bluetooth Speaker",
          sku: "BS004",
          price: 79.99,
          stock: 15,
          category: { name: "Electronics" },
          image: "/placeholder.svg?height=60&width=60",
        },
      ]
      setProducts(mockProducts)
      setFilteredProducts(mockProducts)
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      })
    }
  }

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item._id === product._id)

    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        toast({
          title: "Stock Limit",
          description: `Only ${product.stock} items available in stock`,
          variant: "destructive",
        })
        return
      }

      setCart(cart.map((item) => (item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      if (product.stock === 0) {
        toast({
          title: "Out of Stock",
          description: "This product is out of stock",
          variant: "destructive",
        })
        return
      }

      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId)
      return
    }

    const product = products.find((p) => p._id === productId)
    if (newQuantity > product.stock) {
      toast({
        title: "Stock Limit",
        description: `Only ${product.stock} items available in stock`,
        variant: "destructive",
      })
      return
    }

    setCart(cart.map((item) => (item._id === productId ? { ...item, quantity: newQuantity } : item)))
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item._id !== productId))
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
        items: cart,
        customer,
        subtotal: calculateSubtotal(),
        discount: calculateDiscount(),
        tax: calculateTax(),
        total: calculateTotal(),
        paymentMethod,
        amountReceived: paymentMethod === "cash" ? amountReceived : calculateTotal(),
        change: paymentMethod === "cash" ? calculateChange() : 0,
        saleDate: new Date(),
      }

      // Mock API call - replace with actual API
      console.log("Processing sale:", saleData)

      // Simulate API response
      const saleResponse = {
        _id: Date.now().toString(),
        saleNumber: `SALE-${Date.now()}`,
        ...saleData,
      }

      setCurrentSale(saleResponse)
      setShowPaymentModal(false)
      setShowReceiptModal(true)

      // Clear cart and reset form
      setCart([])
      setCustomer({ name: "", phone: "" })
      setDiscount(0)
      setAmountReceived(0)

      toast({
        title: "Sale Completed",
        description: "Sale has been processed successfully",
      })
    } catch (error) {
      console.error("Error processing sale:", error)
      toast({
        title: "Error",
        description: "Failed to process sale",
        variant: "destructive",
      })
    }
  }

  const printReceipt = () => {
    window.print()
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

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products by name, SKU, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[calc(100vh-200px)] overflow-y-auto">
            {filteredProducts.map((product) => (
              <Card key={product._id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{product.name}</h3>
                      <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                      <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                      <p className="font-bold text-primary">{formatPrice(product.price)}</p>
                    </div>
                    <Button size="sm" onClick={() => addToCart(product)} disabled={product.stock === 0}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="customerName">Name</Label>
                <Input
                  id="customerName"
                  value={customer.name}
                  onChange={(e) => setCustomer((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Customer name"
                />
              </div>
              <div>
                <Label htmlFor="customerPhone">Phone</Label>
                <Input
                  id="customerPhone"
                  value={customer.phone}
                  onChange={(e) => setCustomer((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="Phone number"
                />
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
                <ShoppingCart className="mx-auto h-12 w-12 mb-2" />
                <p>No items in cart</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item._id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">{formatPrice(item.price)} each</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" onClick={() => updateQuantity(item._id, item.quantity - 1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <Button size="sm" variant="outline" onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => removeFromCart(item._id)}>
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
                    </span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
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
