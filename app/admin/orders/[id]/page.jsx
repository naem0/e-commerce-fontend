"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useLanguage } from "@/components/language-provider"
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
  Edit,
} from "lucide-react"
import { formatPrice, formatDate } from "@/services/utils"
import { getOrderById, updateOrderStatus } from "@/services/order.service"
import { PartialPaymentModal } from "@/components/partial-payment-modal"

export default function AdminOrderDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const { t } = useLanguage()
  const { toast } = useToast()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [statusUpdateOpen, setStatusUpdateOpen] = useState(false)
  const [trackingInfo, setTrackingInfo] = useState("")
  const [adminNotes, setAdminNotes] = useState("")

  useEffect(() => {

    fetchOrder()
  }, [status, id])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const response = await getOrderById(id)

      if (response.success) {
        setOrder(response.order)
        setTrackingInfo(response.order.trackingInfo || "")
        setAdminNotes(response.order.adminNotes || "")
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

      const updateData = {
        status: newStatus,
        trackingInfo,
        adminNotes,
      }

      const response = await updateOrderStatus(id, updateData)

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

  const calculateTotalPaid = () => {
    if (!order?.payments) return 0
    return order.payments.reduce((total, payment) => {
      return payment.status === "completed" ? total + payment.amount : total
    }, 0)
  }

  const calculateDueAmount = () => {
    return order?.total - calculateTotalPaid()
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
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

  const totalPaid = calculateTotalPaid()
  const dueAmount = calculateDueAmount()

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
                    <Dialog open={statusUpdateOpen} onOpenChange={setStatusUpdateOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Edit className="mr-1 h-3 w-3" />
                          Update Status
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Update Order Status</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Order Status</Label>
                            <Select defaultValue={order.status} onValueChange={(value) => handleStatusUpdate(value)}>
                              <SelectTrigger>
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
                          <div>
                            <Label htmlFor="trackingInfo">Tracking Information</Label>
                            <Input
                              id="trackingInfo"
                              value={trackingInfo}
                              onChange={(e) => setTrackingInfo(e.target.value)}
                              placeholder="Enter tracking number or info"
                            />
                          </div>
                          <div>
                            <Label htmlFor="adminNotes">Admin Notes</Label>
                            <Textarea
                              id="adminNotes"
                              value={adminNotes}
                              onChange={(e) => setAdminNotes(e.target.value)}
                              placeholder="Internal notes about this order"
                            />
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
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
              <CardTitle>Payment History</CardTitle>
              {dueAmount > 0 && (
                <Button onClick={() => setPaymentModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Payment
                </Button>
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
                        <Badge className={getPaymentStatusColor(payment.status)}>{payment.status}</Badge>
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

      {/* Partial Payment Modal */}
      <PartialPaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        orderId={order._id}
        dueAmount={dueAmount}
        onPaymentAdded={fetchOrder}
      />
    </div>
  )
}
