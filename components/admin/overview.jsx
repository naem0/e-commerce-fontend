"use client"

import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useTranslation } from "@/components/language-provider"

// Sample data for the overview charts
const revenueData = [
  { month: "Jan", revenue: 4000 },
  { month: "Feb", revenue: 4200 },
  { month: "Mar", revenue: 4500 },
  { month: "Apr", revenue: 4800 },
  { month: "May", revenue: 5200 },
  { month: "Jun", revenue: 5500 },
  { month: "Jul", revenue: 5700 },
  { month: "Aug", revenue: 6000 },
  { month: "Sep", revenue: 6300 },
  { month: "Oct", revenue: 6500 },
  { month: "Nov", revenue: 6800 },
  { month: "Dec", revenue: 7000 },
]

const ordersData = [
  { month: "Jan", orders: 120 },
  { month: "Feb", orders: 140 },
  { month: "Mar", orders: 160 },
  { month: "Apr", orders: 180 },
  { month: "May", orders: 200 },
  { month: "Jun", orders: 220 },
  { month: "Jul", orders: 240 },
  { month: "Aug", orders: 260 },
  { month: "Sep", orders: 280 },
  { month: "Oct", orders: 300 },
  { month: "Nov", orders: 320 },
  { month: "Dec", orders: 340 },
]

export function Overview({ chartType = "revenue" }) {
  const { t } = useTranslation()

  if (chartType === "revenue") {
    return (
      <ChartContainer
        config={{
          revenue: {
            label: t("admin.revenue"),
            color: "hsl(var(--chart-1))",
          },
        }}
        className="h-[300px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={revenueData}>
            <XAxis dataKey="month" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    )
  }

  return (
    <ChartContainer
      config={{
        orders: {
          label: t("admin.orders"),
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={ordersData}>
          <XAxis dataKey="month" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="orders" fill="var(--color-orders)" radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
