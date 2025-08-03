"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useLanguage } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import {
  Loader2,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  MapPin,
  CreditCard,
  Star,
  MessageSquare,
} from "lucide-react"
import { formatPrice, formatDate } from "@/services/utils"
import { getOrderById } from "@/services/order.service"
import { ReviewModal } from "@/components/review-modal"

export default function OrderDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const { t } = useLanguage()
  const { toast } = useToast()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    fetchOrder()
  }, [status, id])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const response = await getOrderById(id)

      if (response.success) {
        setOrder(response.order)
      } else {
        throw new Error(response.message || "Order not found")
      }
    } catch (error) {
      console.error("Fetch order error:", error)
      toast({
        title: t("order.error") || "Error",
        description: error.message || "Failed to load order",
        variant: "destructive",
      })
      router.push("/orders")
    } finally {
      setLoading(false)
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
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const canReview = (order) => {
    return order.status === "delivered" && order.paymentStatus === "paid"
  }

  const handleReview = (product) => {
    setSelectedProduct(product)
    setReviewModalOpen(true)
  }

  const getOrderTimeline = () => {
    const timeline = [
      {
        status: "pending",
        label: t("order.pending") || "Order Placed",
        date: order.createdAt,
        completed: true,
      },
      {
        status: "processing",
        label: t("order.processing") || "Processing",
        date: order.status === "processing" ? new Date() : null,
        completed: ["processing", "shipped", "delivered"].includes(order.status),
      },
      {
        status: "shipped",
        label: t("order.shipped") || "Shipped",
        date: order.status === "shipped" ? new Date() : null,
        completed: ["shipped", "delivered"].includes(order.status),
      },
      {
        status: "delivered",
        label: t("order.delivered") || "Delivered",
        date: order.status === "delivered" ? new Date() : null,
        completed: order.status === "delivered",
      },
    ]

    if (order.status === "cancelled") {
      return [
        timeline[0],
        {
          status: "cancelled",
          label: t("order.cancelled") || "Cancelled",
          date: new Date(),
          completed: true,
        },
      ]
    }

    return timeline
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
          <h1 className="text-2xl font-bold mb-4">{t("order.notFound") || "Order not found"}</h1>
          <Button onClick={() => router.push("/orders")}>{t("order.viewOrders") || "View All Orders"}</Button>
        </div>
      </div>
    )
  }

  const timeline = getOrderTimeline()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="outline" onClick={() => router.push("/orders")}>
          ← {t("order.backToOrders") || "Back to Orders"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Header */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">
                    {t("order.orderNumber") || "Order"} #{order._id.slice(-8).toUpperCase()}
                  </CardTitle>
                  <p className="text-gray-600 mt-1">
                    {t("order.placedOn") || "Placed on"} {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <Badge className={`${getStatusColor(order.status)} mb-2`}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1 capitalize">{order.status}</span>
                  </Badge>
                  <br />
                  <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                    <CreditCard className="h-3 w-3 mr-1" />
                    <span className="capitalize">{order.paymentStatus}</span>
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>{t("order.orderTimeline") || "Order Timeline"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timeline.map((step, index) => (
                  <div key={step.status} className="flex items-center">
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        step.completed ? "bg-primary-custom text-white" : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {step.completed ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                    </div>
                    <div className="ml-4 flex-1">
                      <p className={`font-medium ${step.completed ? "text-gray-900" : "text-gray-400"}`}>
                        {step.label}
                      </p>
                      {step.date && <p className="text-sm text-gray-500">{formatDate(step.date)}</p>}
                    </div>
                    {index < timeline.length - 1 && (
                      <div
                        className={`absolute left-4 mt-8 w-0.5 h-4 ${step.completed ? "bg-primary-custom  : "bg-gray-200"}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>{t("order.orderItems") || "Order Items"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="relative h-16 w-16 flex-shrink-0">
                      <Image
                        src={
                          item.product?.images?.[0]
                            ? process.env.NEXT_PUBLIC_API_URL + item.product.images[0]
                            : "/placeholder.svg?height=64&width=64"
                        }
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        {t("order.quantity") || "Quantity"}: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-600">
                        {t("order.price") || "Price"}: {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                      {canReview(order) && (
                        <Button size="sm" variant="outline" onClick={() => handleReview(item.product)} className="mt-2">
                          <Star className="h-3 w-3 mr-1" />
                          {t("order.review") || "Review"}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary & Info */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>{t("order.orderSummary") || "Order Summary"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>{t("order.subtotal") || "Subtotal"}</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("order.tax") || "Tax"}</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("order.shipping") || "Shipping"}</span>
                <span>{formatPrice(order.shippingCost)}</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-lg">
                <span>{t("order.total") || "Total"}</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                {t("order.shippingAddress") || "Shipping Address"}
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
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                {t("order.paymentInfo") || "Payment Information"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{t("order.paymentMethod") || "Payment Method"}</span>
                  <span className="capitalize">{order.paymentMethod.replace("_", " ")}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("order.paymentStatus") || "Payment Status"}</span>
                  <Badge className={getPaymentStatusColor(order.paymentStatus)}>{order.paymentStatus}</Badge>
                </div>
                {order.paymentDetails?.transactionId && (
                  <div className="flex justify-between">
                    <span>{t("order.transactionId") || "Transaction ID"}</span>
                    <span className="font-mono text-sm">{order.paymentDetails.transactionId}</span>
                  </div>
                )}
              </div>

              {order.paymentStatus === "pending" && order.paymentMethod !== "cash_on_delivery" && (
                <Button className="w-full mt-4" onClick={() => router.push(`/payment/${order._id}`)}>
                  {t("order.completePayment") || "Complete Payment"}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Order Notes */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  {t("order.notes") || "Order Notes"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedProduct && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false)
            setSelectedProduct(null)
          }}
          product={selectedProduct}
          orderId={order._id}
        />
      )}
    </div>
  )
}
