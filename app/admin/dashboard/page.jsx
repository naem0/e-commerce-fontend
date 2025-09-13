"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Package, ShoppingCart, Users, DollarSign, TrendingUp, AlertTriangle, BarChart3 } from "lucide-react"
import { getDashboardAnalytics } from "@/services/analytics.service"
import { formatPrice } from "@/services/utils"
import { Overview } from "@/components/admin/overview"
import { RecentOrders } from "@/components/admin/recent-orders"

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [period, setPeriod] = useState("30")

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        const response = await getDashboardAnalytics(period)

        if (response.success) {
          setAnalytics(response.data)
        } else {
          throw new Error(response.message || "Failed to fetch analytics")
        }
      } catch (err) {
        console.error("Error fetching analytics:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (status === "authenticated" && session.user.role === "admin") {
      fetchAnalytics()
    }
  }, [status, period])

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary-custom" />
      </div>
    )
  }

  if (status === "authenticated" && session.user.role !== "admin") {
    return null // Will redirect in useEffect
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {session?.user?.name}</p>
        </div>
        <div className="flex gap-2">
          <Button variant={period === "7" ? "default" : "outline"} size="sm" onClick={() => setPeriod("7")}>
            7 Days
          </Button>
          <Button variant={period === "30" ? "default" : "outline"} size="sm" onClick={() => setPeriod("30")}>
            30 Days
          </Button>
          <Button variant={period === "90" ? "default" : "outline"} size="sm" onClick={() => setPeriod("90")}>
            90 Days
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      ) : (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Total Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.overview?.totalProducts || 0}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+12%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Total Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.overview?.totalOrders || 0}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+8%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.overview?.totalUsers || 0}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+15%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPrice(analytics?.overview?.totalRevenue || 0)}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+23%</span> from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Due Amount Alert */}
          {analytics?.overview?.totalDue > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <span className="font-medium text-orange-800">
                    Total Due Amount: {formatPrice(analytics.overview.totalDue)}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Charts and Analytics */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="sales" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Sales
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Products
              </TabsTrigger>
              <TabsTrigger value="customers" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Customers
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Overview chartType="revenue" data={analytics?.revenueData} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Orders Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Overview chartType="orders" data={analytics?.revenueData} />
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <RecentOrders orders={analytics?.recentOrders} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sales" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Category Wise Sales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics?.categoryWiseSales?.slice(0, 5).map((category, index) => (
                        <div key={category._id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{category.categoryName}</p>
                            <p className="text-sm text-gray-600">{category.totalSold} items sold</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{formatPrice(category.totalRevenue)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Brand Wise Sales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics?.brandWiseSales?.slice(0, 5).map((brand, index) => (
                        <div key={brand._id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{brand.brandName || "No Brand"}</p>
                            <p className="text-sm text-gray-600">{brand.totalSold} items sold</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{formatPrice(brand.totalRevenue)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Order Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {analytics?.orderStatusDistribution?.map((status) => (
                      <div key={status._id} className="text-center">
                        <Badge className={getStatusColor(status._id)} variant="secondary">
                          {status._id}
                        </Badge>
                        <p className="text-2xl font-bold mt-2">{status.count}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Best Selling Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics?.bestSellingProducts?.slice(0, 5).map((product, index) => (
                        <div key={product._id} className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            {product.product?.images?.[0] ? (
                              <img
                                src={product.product.images[0] || "/placeholder.svg"}
                                alt={product.productName}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <Package className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{product.productName}</p>
                            <p className="text-sm text-gray-600">{product.totalSold} sold</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{formatPrice(product.totalRevenue)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      Low Stock Alert
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics?.lowStockProducts?.slice(0, 5).map((product) => (
                        <div key={product._id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-600">{product.category?.name}</p>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant={product.stock === 0 ? "destructive" : "secondary"}
                              className={product.stock <= 5 ? "bg-red-100 text-red-800" : ""}
                            >
                              {product.stock} left
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="customers" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {analytics?.paymentStatusDistribution?.map((payment) => (
                      <div key={payment._id} className="text-center p-4 border rounded-lg">
                        <p className="text-sm text-gray-600 capitalize">{payment._id}</p>
                        <p className="text-2xl font-bold">{payment.count}</p>
                        <p className="text-sm font-medium">{formatPrice(payment.totalAmount)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
