"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart, DollarSign, Clock, CreditCard, Package, Users, TrendingUp } from "lucide-react"
import { formatPrice } from "@/services/utils"

export function CashierDashboard({ analytics, user }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">POS Dashboard</h1>
          <p className="text-gray-600">Welcome, {user?.name} - Ready to serve customers</p>
        </div>
        <Badge variant="outline" className="text-sm">
          Cashier
        </Badge>
      </div>

      {/* Today's Performance */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Sales Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.today?.sales || 0}</div>
            <p className="text-xs text-muted-foreground">Transactions processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Revenue Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(analytics?.today?.revenue || 0)}</div>
            <p className="text-xs text-muted-foreground">Cash + Card payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Customers Served
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.today?.customers || 0}</div>
            <p className="text-xs text-muted-foreground">Unique customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Avg. Sale Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(analytics?.today?.avgSale || 0)}</div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button className="h-20 flex flex-col items-center justify-center">
                <ShoppingCart className="h-6 w-6 mb-2" />
                <span className="text-sm">New Sale</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center bg-transparent">
                <Package className="h-6 w-6 mb-2" />
                <span className="text-sm">Check Stock</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center bg-transparent">
                <CreditCard className="h-6 w-6 mb-2" />
                <span className="text-sm">Payment</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center bg-transparent">
                <Clock className="h-6 w-6 mb-2" />
                <span className="text-sm">Break Time</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics?.recentTransactions?.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="text-sm font-medium">#{transaction.id}</p>
                    <p className="text-xs text-gray-600">{transaction.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatPrice(transaction.amount)}</p>
                    <Badge variant="outline" className="text-xs">
                      {transaction.method}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shift Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Shift Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{analytics?.shift?.startTime || "9:00 AM"}</p>
              <p className="text-sm text-gray-600">Shift Start</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{analytics?.shift?.hoursWorked || 0}h</p>
              <p className="text-sm text-gray-600">Hours Worked</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{analytics?.shift?.totalSales || 0}</p>
              <p className="text-sm text-gray-600">Total Sales</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{formatPrice(analytics?.shift?.totalRevenue || 0)}</p>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
