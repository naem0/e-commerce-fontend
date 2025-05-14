export interface ChartConfig {
  revenue?: {
    label: string
    color: string
  }
  orders?: {
    label: string
    color: string
  }
}

export interface ChartData {
  name: string
  total: number
}
