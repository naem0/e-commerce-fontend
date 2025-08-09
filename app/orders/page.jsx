"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { PackageOpen, ShoppingBag } from "lucide-react"
import { getOrders } from "@/services/order.service"

export default function OrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/orders")
    }

    if (status === "authenticated") {
      fetchOrders()
    }
  }, [status, router])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await getOrders()

      if (response.success) {
        setOrders(response.orders)
      } else {
        throw new Error(data.message || "Failed to fetch orders")
      }
    } catch (err) {
      console.error("Error fetching orders:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "shipped":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    }
  }

  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-10 w-1/4 mb-8" />
        <div className="grid grid-cols-1 gap-6">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-40 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchOrders}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {loading ? (
        <div className="grid grid-cols-1 gap-6">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-40 w-full" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-6">
              You haven't placed any orders yet.
            </p>
            <Link href="/products">
              <Button>Start Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <Card key={order._id}>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle>
                    Order #{order._id}
                  </CardTitle>
                  <CardDescription>
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(order.status)}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Items</h3>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item._id} className="flex justify-between">
                          <div className="flex items-center gap-2">
                            <PackageOpen className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {item.quantity} x {item.product.name}
                            </span>
                          </div>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-end">
                    <Link href={`/orders/${order._id}`}>
                      <Button variant="outline">View Details</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
