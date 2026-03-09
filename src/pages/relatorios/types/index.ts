export type ReportCategory = "finance" | "clients" | "services" | "occupancy"
export type ReportPeriod = "7d" | "30d" | "90d" | "12m" | "custom"

export interface ChartDataPoint {
  date: string
  value: number
  secondaryValue?: number
  label?: string
}

export interface ReportSummary {
  title: string
  value: string | number
  change: number
  isPositive: boolean
  prefix?: string
  suffix?: string
}

export interface FinancialReport {
  revenueOverTime: ChartDataPoint[]
  expensesOverTime: ChartDataPoint[]
  revenueByService: { name: string; value: number; color: string }[]
  summary: ReportSummary[]
}

export interface ClientReport {
  newClientsOverTime: ChartDataPoint[]
  retentionRate: number
  demographics: { label: string; value: number }[]
  topClients: { name: string; appointments: number; totalSpent: number }[]
  summary: ReportSummary[]
}

export interface ServiceReport {
  mostRequestedServices: { name: string; count: number; revenue: number }[]
  averageServiceTime: number
  servicesByCategory: { name: string; value: number }[]
  summary: ReportSummary[]
}

export interface ReportFilters {
  category: ReportCategory
  period: ReportPeriod
  startDate?: string
  endDate?: string
  unitId?: string
}
