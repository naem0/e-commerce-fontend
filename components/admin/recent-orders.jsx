"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { OrderAPI } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ExternalLink } from "lucide-react"

export function RecentOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        setLoading(true)

        const response = await OrderAPI.getAll()

        // Get the 5 most recent orders
        const recentOrders = response.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)

        setOrders(recentOrders)
      } catch (err) {
        console.error("Error fetching recent orders:", err)
        setError("Failed to load recent orders")
      } finally {
        setLoading(false)
      }
    }

    fetchRecentOrders()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "processing":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "shipped":
        return "bg-violet-100 text-violet-800 hover:bg-violet-200"
      case "delivered":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between border-b pb-3">
            <div className="space-y-1">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-8 w-24" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (orders.length === 0) {
    return <div className="text-center py-8">No orders found</div>
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order._id} className="flex items-center justify-between border-b pb-4">
          <div>
            <p className="font-medium">Order #{order._id.substr(-6)}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString()} · ${order.total.toFixed(2)}
            </p>
            <Badge className={getStatusColor(order.status)}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/admin/orders/${order._id}`}>
              <ExternalLink className="h-4 w-4 mr-1" />
              View
            </Link>
          </Button>
        </div>
      ))}
      <div className="pt-2 text-center">
        <Button variant="outline" asChild>
          <Link href="/admin/orders">View All Orders</Link>
        </Button>
      </div>
    </div>
  )
}
