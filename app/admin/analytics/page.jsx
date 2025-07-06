"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Loader2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Download,
  Filter,
  BarChart3,
  PieChart,
} from "lucide-react"
import { getDashboardAnalytics, getSalesReport, getTopCustomers } from "@/services/analytics.service"
import { formatPrice } from "@/services/utils"

export default function AnalyticsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState(null)
  const [salesReport, setSalesReport] = useState([])
  const [topCustomers, setTopCustomers] = useState([])
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  })
  const [groupBy, setGroupBy] = useState("day")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/admin/analytics")
    } else if (status === "authenticated" && session.user.role !== "admin") {
      router.push("/")
    }
  }, [status, session, router])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch all analytics data
        const [analyticsRes, salesRes, customersRes] = await Promise.all([
          getDashboardAnalytics("30"),
          getSalesReport({ groupBy }),
          getTopCustomers(),
        ])

        if (analyticsRes.success) setAnalytics(analyticsRes.data)
        if (salesRes.success) setSalesReport(salesRes.data)
        if (customersRes.success) setTopCustomers(customersRes.data)
      } catch (error) {
        console.error("Error fetching analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    if (status === "authenticated" && session.user.role === "admin") {
      fetchData()
    }
  }, [status, session, groupBy])

  const handleDateRangeSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await getSalesReport({
        ...dateRange,
        groupBy,
      })
      if (response.success) {
        setSalesReport(response.data)
      }
    } catch (error) {
      console.error("Error fetching sales report:", error)
    } finally {
      setLoading(false)
    }
  }

  const exportReport = () => {
    // Create CSV content
    const csvContent = [
      ["Date", "Orders", "Revenue", "Due Amount", "Average Order Value"],
      ...salesReport.map((item) => [
        `${item._id.year}-${item._id.month}-${item._id.day || ""}`,
        item.totalOrders,
        item.totalRevenue,
        item.totalDue,
        item.averageOrderValue.toFixed(2),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `sales-report-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  if (status === "authenticated" && session.user.role !== "admin") {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-gray-600">Detailed business insights and reports</p>
        </div>
        <Button onClick={exportReport} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">{formatPrice(analytics?.overview?.totalRevenue || 0)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+12.5%</span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{analytics?.overview?.totalOrders || 0}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+8.2%</span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold">{analytics?.overview?.totalUsers || 0}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+15.3%</span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Due Amount</p>
                <p className="text-2xl font-bold text-red-600">{formatPrice(analytics?.overview?.totalDue || 0)}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-red-500">Pending payments</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Sales Report
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Product Analytics
          </TabsTrigger>
          <TabsTrigger value="customers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Customer Analytics
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Category & Brand
          </TabsTrigger>
        </TabsList>

        {/* Sales Report */}
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Sales Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDateRangeSubmit} className="flex flex-wrap gap-4 items-end">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Group By</Label>
                  <Select value={groupBy} onValueChange={setGroupBy}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Day</SelectItem>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="month">Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit">Apply Filter</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sales Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Orders</th>
                      <th className="text-left p-2">Revenue</th>
                      <th className="text-left p-2">Due</th>
                      <th className="text-left p-2">Avg Order</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesReport.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-2">
                          {item._id.year}-{item._id.month}-{item._id.day || ""}
                        </td>
                        <td className="p-2">{item.totalOrders}</td>
                        <td className="p-2 font-medium">{formatPrice(item.totalRevenue)}</td>
                        <td className="p-2 text-red-600">{formatPrice(item.totalDue)}</td>
                        <td className="p-2">{formatPrice(item.averageOrderValue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Product Analytics */}
        <TabsContent value="products" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Best Selling Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.bestSellingProducts?.slice(0, 10).map((product, index) => (
                    <div key={product._id} className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">#{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{product.productName}</p>
                        <p className="text-sm text-gray-600">{product.totalSold} units sold</p>
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
                <CardTitle>Low Stock Alert</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.lowStockProducts?.map((product) => (
                    <div key={product._id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.category?.name}</p>
                      </div>
                      <Badge
                        variant={product.stock === 0 ? "destructive" : "secondary"}
                        className={product.stock <= 5 ? "bg-red-100 text-red-800" : ""}
                      >
                        {product.stock} left
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Customer Analytics */}
        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Customer</th>
                      <th className="text-left p-2">Email</th>
                      <th className="text-left p-2">Orders</th>
                      <th className="text-left p-2">Total Spent</th>
                      <th className="text-left p-2">Avg Order</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topCustomers.map((customer, index) => (
                      <tr key={customer._id} className="border-b hover:bg-gray-50">
                        <td className="p-2">
                          <div>
                            <p className="font-medium">{customer.user.name}</p>
                            <p className="text-sm text-gray-600">{customer.user.phone}</p>
                          </div>
                        </td>
                        <td className="p-2">{customer.user.email}</td>
                        <td className="p-2">{customer.totalOrders}</td>
                        <td className="p-2 font-medium">{formatPrice(customer.totalSpent)}</td>
                        <td className="p-2">{formatPrice(customer.averageOrderValue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Category & Brand Analytics */}
        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Category Wise Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.categoryWiseSales?.map((category, index) => (
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
                  {analytics?.brandWiseSales?.map((brand, index) => (
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
