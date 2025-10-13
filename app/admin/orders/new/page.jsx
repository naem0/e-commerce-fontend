"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { getUsers } from "@/services/user.service"
import { getProducts } from "@/services/product.service"
import { createOrderByAdmin } from "@/services/order.service"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function NewOrderPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [userType, setUserType] = useState("registered")
  const [selectedUser, setSelectedUser] = useState("")
  const [guestCustomer, setGuestCustomer] = useState({ name: "", email: "", phone: "" })
  const [shippingAddress, setShippingAddress] = useState({ street: "", city: "", state: "", zipCode: "", country: "" })
  const [selectedProducts, setSelectedProducts] = useState([])
  const [status, setStatus] = useState("pending")
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await getUsers()
        setUsers(usersResponse.users)
        const productsResponse = await getProducts()
        setProducts(productsResponse.products)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to fetch users or products. Please try again.",
          variant: "destructive",
        })
      }
    }
    fetchData()
  }, [toast])

  const handleAddProduct = () => {
    setSelectedProducts([...selectedProducts, { productId: "", quantity: 1, price: 0 }])
  }

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...selectedProducts]
    if (field === "productId") {
      const product = products.find((p) => p._id === value)
      updatedProducts[index].price = product.price
    }
    updatedProducts[index][field] = value
    setSelectedProducts(updatedProducts)
    calculateTotal(updatedProducts)
  }

  const calculateTotal = (products) => {
    const total = products.reduce((acc, product) => acc + product.price * product.quantity, 0)
    setTotal(total)
  }

  const handleGuestChange = (e) => {
    setGuestCustomer({ ...guestCustomer, [e.target.name]: e.target.value })
  }

  const handleAddressChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const orderData = {
        userType,
        items: selectedProducts.map((p) => ({ product: p.productId, quantity: p.quantity })),
        status,
        paymentMethod,
        total,
      }

      if (userType === "registered") {
        orderData.user = selectedUser
      } else {
        orderData.customer = guestCustomer
        orderData.shippingAddress = shippingAddress
      }

      await createOrderByAdmin(orderData)
      toast({
        title: "Order Created",
        description: "The new order has been created successfully.",
      })
      router.push("/admin/orders")
    } catch (error) {
      console.error("Error creating order:", error)
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Create New Order</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Order Details</CardTitle>
          <CardDescription>Fill in the details to create a new order.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center space-x-2">
              <Label htmlFor="user-type">Guest User</Label>
              <Switch
                id="user-type"
                checked={userType === "guest"}
                onCheckedChange={() => setUserType(userType === "registered" ? "guest" : "registered")}
              />
            </div>

            {userType === "registered" ? (
              <div className="space-y-2">
                <label htmlFor="user">User</label>
                <Select onValueChange={setSelectedUser} value={selectedUser}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user._id} value={user._id}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Full Name" name="name" value={guestCustomer.name} onChange={handleGuestChange} />
                <Input placeholder="Email" name="email" value={guestCustomer.email} onChange={handleGuestChange} />
                <Input placeholder="Phone" name="phone" value={guestCustomer.phone} onChange={handleGuestChange} />
                <Input placeholder="Street" name="street" value={shippingAddress.street} onChange={handleAddressChange} />
                <Input placeholder="City" name="city" value={shippingAddress.city} onChange={handleAddressChange} />
                <Input placeholder="State" name="state" value={shippingAddress.state} onChange={handleAddressChange} />
                <Input placeholder="Zip Code" name="zipCode" value={shippingAddress.zipCode} onChange={handleAddressChange} />
                <Input placeholder="Country" name="country" value={shippingAddress.country} onChange={handleAddressChange} />
              </div>
            )}

            <div className="space-y-4">
              <label>Products</label>
              {selectedProducts.map((product, index) => (
                <div key={index} className="flex items-center gap-4">
                  <Select
                    onValueChange={(value) => handleProductChange(index, "productId", value)}
                    value={product.productId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((p) => (
                        <SelectItem key={p._id} value={p._id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    min="1"
                    value={product.quantity}
                    onChange={(e) => handleProductChange(index, "quantity", parseInt(e.target.value))}
                    className="w-24"
                  />
                  <span>${(product.price * product.quantity)?.toFixed(2)}</span>
                </div>
              ))}
              <Button type="button" onClick={handleAddProduct} variant="outline">
                Add Product
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="status">Status</label>
                <Select onValueChange={setStatus} value={status}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="paymentMethod">Payment Method</label>
                <Select onValueChange={setPaymentMethod} value={paymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cod">Cash on Delivery</SelectItem>
                    <SelectItem value="bkash">Bkash</SelectItem>
                    <SelectItem value="nagad">Nagad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="text-2xl font-bold">Total: ${total?.toFixed(2)}</div>

            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Order"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
