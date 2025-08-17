"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Loader2,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  CreditCard,
  User,
  Phone,
  Mail,
  Download,
  Printer,
  Plus,
  Check,
  X,
} from "lucide-react"
import { formatPrice, formatDate } from "@/services/utils"
import { getOrderById, updateOrderStatus, addPartialPayment, confirmPayment } from "@/services/order.service"

export default function AdminOrderDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [statusUpdateOpen, setStatusUpdateOpen] = useState(false)
  const [trackingInfo, setTrackingInfo] = useState("")
  const [adminNotes, setAdminNotes] = useState("")
  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    method: "bkash",
    transactionId: "",
    phoneNumber: "",
    notes: "",
  })

  useEffect(() => {
    if (session?.accessToken && id) {
      fetchOrder()
    }
  }, [session?.accessToken, id])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const response = await getOrderById(id)

      if (response.success) {
        setOrder(response.order)
        setTrackingInfo(response.order.trackingInfo || "")
        setAdminNotes(response.order.adminNotes || "")

        // Set default payment amount to due amount
        const dueAmount = calculateDueAmount(response.order)
        setPaymentForm((prev) => ({
          ...prev,
          amount: dueAmount.toString(),
        }))
      } else {
        throw new Error(response.message || "Order not found")
      }
    } catch (error) {
      console.error("Fetch order error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to load order",
        variant: "destructive",
      })
      router.push("/admin/orders")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdating(true)
      const response = await updateOrderStatus(id, newStatus)

      if (response.success) {
        setOrder(response.order)
        setStatusUpdateOpen(false)
        toast({
          title: "Success",
          description: "Order status updated successfully",
        })
      } else {
        throw new Error(response.message || "Update failed")
      }
    } catch (error) {
      console.error("Status update error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update order status",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  const handleAddPayment = async () => {
    try {
      if (!paymentForm.amount || Number.parseFloat(paymentForm.amount) <= 0) {
        toast({
          title: "Error",
          description: "Please enter a valid payment amount",
          variant: "destructive",
        })
        return
      }

      const formData = new FormData()
      formData.append("amount", paymentForm.amount)
      formData.append("method", paymentForm.method)
      formData.append("transactionId", paymentForm.transactionId)
      formData.append("phoneNumber", paymentForm.phoneNumber)
      formData.append("notes", paymentForm.notes)

      const response = await addPartialPayment(id, formData)

      if (response.success) {
        toast({
          title: "Success",
          description: "Payment added successfully",
        })
        setPaymentModalOpen(false)
        setPaymentForm({
          amount: "",
          method: "bkash",
          transactionId: "",
          phoneNumber: "",
          notes: "",
        })
        fetchOrder()
      } else {
        throw new Error(response.message || "Failed to add payment")
      }
    } catch (error) {
      console.error("Add payment error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to add payment",
        variant: "destructive",
      })
    }
  }

  const handleConfirmPayment = async (paymentId, status, adminNote = "") => {
    try {
      const response = await confirmPayment(id, paymentId, { status, adminNote })

      if (response.success) {
        toast({
          title: "Success",
          description: `Payment ${status} successfully`,
        })
        fetchOrder()
      } else {
        throw new Error(response.message || `Failed to ${status} payment`)
      }
    } catch (error) {
      console.error("Confirm payment error:", error)
      toast({
        title: "Error",
        description: error.message || `Failed to ${status} payment`,
        variant: "destructive",
      })
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "processing":
        return <Package className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "partial":
        return "bg-yellow-100 text-yellow-800"
      case "pending":
        return "bg-orange-100 text-orange-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const calculateTotalPaid = (order) => {
    if (!order?.payments) return 0
    return order.payments.reduce((total, payment) => {
      return payment.status === "confirmed" ? total + payment.amount : total
    }, 0)
  }

  const calculateDueAmount = (order) => {
    if (!order) return 0
    return order.total - calculateTotalPaid(order)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary-custom" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Order not found</h1>
          <Button onClick={() => router.push("/admin/orders")}>Back to Orders</Button>
        </div>
      </div>
    )
  }

  const totalPaid = calculateTotalPaid(order)
  const dueAmount = calculateDueAmount(order)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <Button variant="outline" onClick={() => router.push("/admin/orders")}>
          ← Back to Orders
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.push(`/admin/orders/${id}/invoice`)}>
            <Download className="mr-2 h-4 w-4" />
            Download Invoice
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Header */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">Order #{order._id.slice(-8).toUpperCase()}</CardTitle>
                  <p className="text-gray-600 mt-1">Placed on {formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right space-y-2">
                  <Badge className={`${getStatusColor(order.status)} mb-2`}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1 capitalize">{order.status}</span>
                  </Badge>
                  <br />
                  <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                    <CreditCard className="h-3 w-3 mr-1" />
                    <span className="capitalize">{order.paymentStatus}</span>
                  </Badge>
                  <div className="mt-2">
                    <Select value={order.status} onValueChange={handleStatusUpdate}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
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
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">{order.user?.name || "N/A"}</p>
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <Mail className="mr-1 h-3 w-3" />
                    {order.user?.email || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <Phone className="mr-1 h-3 w-3" />
                    {order.user?.phone || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Customer ID: {order.user?._id}</p>
                  <p className="text-sm text-gray-600">
                    Member since: {order.user?.createdAt ? formatDate(order.user.createdAt) : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="relative h-16 w-16 flex-shrink-0">
                      <Image
                        src={item.product?.images?.[0] || "/placeholder.svg?height=64&width=64"}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      {item.variation && item.variation.options && (
                        <p className="text-xs text-muted-foreground">
                          {item.variation.options
                            .map((option) => `${option.type}: ${option.value}`)
                            .join(", ")}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">SKU: {item.product?.sku || "N/A"}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-600">Unit Price: {formatPrice(item.price)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Payment Management</CardTitle>
              {dueAmount > 0 && (
                <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Payment
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Payment</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="amount">Amount</Label>
                          <Input
                            id="amount"
                            type="number"
                            value={paymentForm.amount}
                            onChange={(e) => setPaymentForm((prev) => ({ ...prev, amount: e.target.value }))}
                            placeholder="Enter amount"
                            max={dueAmount}
                          />
                        </div>
                        <div>
                          <Label htmlFor="method">Payment Method</Label>
                          <Select
                            value={paymentForm.method}
                            onValueChange={(value) => setPaymentForm((prev) => ({ ...prev, method: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bkash">bKash</SelectItem>
                              <SelectItem value="nagad">Nagad</SelectItem>
                              <SelectItem value="rocket">Rocket</SelectItem>
                              <SelectItem value="bank">Bank Transfer</SelectItem>
                              <SelectItem value="cash">Cash</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="transactionId">Transaction ID</Label>
                        <Input
                          id="transactionId"
                          value={paymentForm.transactionId}
                          onChange={(e) => setPaymentForm((prev) => ({ ...prev, transactionId: e.target.value }))}
                          placeholder="Enter transaction ID"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input
                          id="phoneNumber"
                          value={paymentForm.phoneNumber}
                          onChange={(e) => setPaymentForm((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                          placeholder="Enter phone number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          value={paymentForm.notes}
                          onChange={(e) => setPaymentForm((prev) => ({ ...prev, notes: e.target.value }))}
                          placeholder="Add payment notes"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setPaymentModalOpen(false)} className="flex-1">
                          Cancel
                        </Button>
                        <Button onClick={handleAddPayment} className="flex-1">
                          Add Payment
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Payment Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="font-bold text-lg">{formatPrice(order.total)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Paid Amount</p>
                      <p className="font-bold text-lg text-green-600">{formatPrice(totalPaid)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Due Amount</p>
                      <p className="font-bold text-lg text-red-600">{formatPrice(dueAmount)}</p>
                    </div>
                  </div>
                </div>

                {/* Payment List */}
                {order.payments && order.payments.length > 0 ? (
                  <div className="space-y-2">
                    {order.payments.map((payment, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded">
                        <div>
                          <p className="font-medium">{formatPrice(payment.amount)}</p>
                          <p className="text-sm text-gray-600">
                            {payment.method} • {formatDate(payment.date)}
                          </p>
                          {payment.transactionId && (
                            <p className="text-xs text-gray-500">ID: {payment.transactionId}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              payment.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : payment.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {payment.status}
                          </Badge>
                          {payment.status === "pending" && (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleConfirmPayment(payment._id, "confirmed")}
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleConfirmPayment(payment._id, "rejected", "Payment rejected by admin")
                                }
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">No payments recorded</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary & Info */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{formatPrice(order.shippingCost)}</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
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
            <CardContent>
              <div className="text-sm space-y-1">
                <p className="font-medium">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}
                  {order.shippingAddress.state && `, ${order.shippingAddress.state}`}
                  {order.shippingAddress.zipCode && ` ${order.shippingAddress.zipCode}`}
                </p>
                <p>{order.shippingAddress.country}</p>
                {order.shippingAddress.phone && (
                  <p className="flex items-center mt-2">
                    <Phone className="mr-1 h-3 w-3" />
                    {order.shippingAddress.phone}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Payment Method</span>
                  <span className="capitalize">{order.paymentMethod.replace("_", " ")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Status</span>
                  <Badge className={getPaymentStatusColor(order.paymentStatus)}>{order.paymentStatus}</Badge>
                </div>
                {order.paymentDetails?.transactionId && (
                  <div className="flex justify-between">
                    <span>Transaction ID</span>
                    <span className="font-mono text-sm">{order.paymentDetails.transactionId}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tracking Info */}
          {order.trackingInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="mr-2 h-5 w-5" />
                  Tracking Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{order.trackingInfo}</p>
              </CardContent>
            </Card>
          )}

          {/* Admin Notes */}
          {order.adminNotes && (
            <Card>
              <CardHeader>
                <CardTitle>Admin Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{order.adminNotes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
