"use client"

export function ChartContainer({ config, children, className, ...props }) {
  return (
    <div
      className={className}
      style={{
        "--color-revenue": config.revenue?.color,
        "--color-orders": config.orders?.color,
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null
  }

  return <ChartTooltipContent payload={payload} label={label} />
}

export function ChartTooltipContent({ payload, label }) {
  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col">
          <span className="text-[0.70rem] uppercase text-muted-foreground">{label}</span>
          <span className="font-bold text-muted-foreground">{payload?.[0]?.value}</span>
        </div>
      </div>
    </div>
  )
}
