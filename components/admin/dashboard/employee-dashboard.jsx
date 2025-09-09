"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, ShoppingCart, Clock, CheckCircle, AlertCircle, ClipboardList, BarChart3 } from "lucide-react"
import { formatPrice } from "@/services/utils"

export function EmployeeDashboard({ analytics, user }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600">Here's your daily overview</p>
        </div>
        <Badge variant="outline" className="text-sm">
          Employee
        </Badge>
      </div>

      {/* Personal Performance */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Tasks Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.personal?.tasksCompleted || 0}</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Orders Processed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.personal?.ordersProcessed || 0}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Hours Worked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.personal?.hoursWorked || 0}h</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Performance Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{analytics?.personal?.performanceScore || 0}%</div>
            <p className="text-xs text-muted-foreground">Above average</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-800">Pending Tasks</span>
              </div>
              <Badge variant="outline">{analytics?.tasks?.pending || 0}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">Completed Today</span>
              </div>
              <Badge variant="outline">{analytics?.tasks?.completed || 0}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <span className="font-medium text-orange-800">Urgent Items</span>
              </div>
              <Badge variant="destructive">{analytics?.tasks?.urgent || 0}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Tabs */}
      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tasks">My Tasks</TabsTrigger>
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Today's Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics?.todayTasks?.map((task, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-gray-600">{task.description}</p>
                      </div>
                      <Badge
                        variant={
                          task.priority === "high"
                            ? "destructive"
                            : task.priority === "medium"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  ))}
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
                    Check Inventory
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Process Orders
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    <ClipboardList className="h-4 w-4 mr-2" />
                    Update Task Status
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Orders I've Processed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.myOrders?.map((order, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-sm text-gray-600">{order.customer}</p>
                      <p className="text-xs text-gray-500">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatPrice(order.amount)}</p>
                      <Badge variant={order.status === "completed" ? "default" : "secondary"}>{order.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Orders Processed</span>
                    <span className="font-bold">{analytics?.weeklyPerformance?.orders || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tasks Completed</span>
                    <span className="font-bold">{analytics?.weeklyPerformance?.tasks || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Customer Rating</span>
                    <span className="font-bold text-green-600">{analytics?.weeklyPerformance?.rating || 0}/5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Efficiency Score</span>
                    <span className="font-bold text-blue-600">{analytics?.weeklyPerformance?.efficiency || 0}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Goals & Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-medium text-green-800">Monthly Goal</p>
                    <p className="text-xs text-green-600">Process 150 orders - 78% complete</p>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">Quality Score</p>
                    <p className="text-xs text-blue-600">Maintain 95% accuracy - Achieved!</p>
                  </div>
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-sm font-medium text-purple-800">Team Collaboration</p>
                    <p className="text-xs text-purple-600">Help 5 colleagues - 3/5 complete</p>
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
