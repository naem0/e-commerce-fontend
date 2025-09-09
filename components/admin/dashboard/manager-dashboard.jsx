"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Warehouse,
  ClipboardList,
} from "lucide-react"
import { Overview } from "@/components/admin/overview"
import { RecentOrders } from "@/components/admin/recent-orders"
import { formatPrice } from "@/services/utils"

export function ManagerDashboard({ analytics }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manager Dashboard</h1>
          <p className="text-gray-600">Oversee operations and team performance</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          Manager Access
        </Badge>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Today's Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.today?.orders || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5%</span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Today's Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(analytics?.today?.revenue || 0)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Package className="h-4 w-4" />
              Low Stock Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{analytics?.inventory?.lowStock || 0}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Active Staff
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.staff?.active || 0}</div>
            <p className="text-xs text-muted-foreground">{analytics?.staff?.total || 0} total staff</p>
          </CardContent>
        </Card>
      </div>

      {/* Urgent Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="font-medium text-red-800">Pending Orders</span>
              </div>
              <Badge variant="destructive">{analytics?.pending?.orders || 0}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Warehouse className="h-5 w-5 text-yellow-600" />
                <span className="font-medium text-yellow-800">Stock Alerts</span>
              </div>
              <Badge variant="secondary">{analytics?.inventory?.alerts || 0}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-800">Tasks Pending</span>
              </div>
              <Badge variant="outline">{analytics?.tasks?.pending || 0}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
      <Tabs defaultValue="operations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="team">Team Performance</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="operations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Sales Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <Overview chartType="revenue" data={analytics?.dailySales} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Orders to Process</span>
                    <Badge variant="destructive">{analytics?.processing?.pending || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Ready to Ship</span>
                    <Badge variant="secondary">{analytics?.processing?.ready || 0}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Shipped Today</span>
                    <Badge variant="default">{analytics?.processing?.shipped || 0}</Badge>
                  </div>
                </div>
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

        <TabsContent value="inventory" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Total Products</span>
                    <span className="font-bold">{analytics?.inventory?.total || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>In Stock</span>
                    <span className="font-bold text-green-600">{analytics?.inventory?.inStock || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Low Stock</span>
                    <span className="font-bold text-orange-600">{analytics?.inventory?.lowStock || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Out of Stock</span>
                    <span className="font-bold text-red-600">{analytics?.inventory?.outOfStock || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    <Package className="h-4 w-4 mr-2" />
                    Update Stock Levels
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    <Warehouse className="h-4 w-4 mr-2" />
                    Generate Stock Report
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Review Low Stock Items
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Staff Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.staffPerformance?.map((staff, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{staff.name}</p>
                        <p className="text-sm text-gray-600">{staff.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{staff.ordersProcessed} orders</p>
                        <p className="text-sm text-gray-600">{formatPrice(staff.salesAmount)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Average Order Processing Time</span>
                    <span className="font-bold">{analytics?.teamMetrics?.avgProcessingTime || "N/A"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Customer Satisfaction</span>
                    <span className="font-bold text-green-600">{analytics?.teamMetrics?.satisfaction || "N/A"}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Orders per Hour</span>
                    <span className="font-bold">{analytics?.teamMetrics?.ordersPerHour || "N/A"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Generate Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Sales Report
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    <Package className="h-4 w-4 mr-2" />
                    Inventory Report
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    <Users className="h-4 w-4 mr-2" />
                    Staff Performance Report
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    <ClipboardList className="h-4 w-4 mr-2" />
                    Operations Summary
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-medium text-green-800">Best Performing Day</p>
                    <p className="text-xs text-green-600">
                      Monday - {formatPrice(analytics?.insights?.bestDay?.revenue || 0)}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">Top Category</p>
                    <p className="text-xs text-blue-600">{analytics?.insights?.topCategory || "Electronics"}</p>
                  </div>
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-sm font-medium text-purple-800">Peak Hours</p>
                    <p className="text-xs text-purple-600">{analytics?.insights?.peakHours || "2PM - 4PM"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
