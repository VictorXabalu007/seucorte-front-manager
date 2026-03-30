export type CommissionType = "SERVICE" | "PRODUCT"
export type PaymentStatus = "PENDING" | "PAID"

export interface CommissionTransaction {
  id: string
  date: string
  type: CommissionType
  description: string
  barberId: string
  professionalId: string
  barberName: string
  avatar?: string
  totalValue: number
  commissionValue: number
  houseValue: number
  status: PaymentStatus
  isPlano: boolean
  planName?: string | null
  creditosUsados?: number | null
}

export interface BarberCommissionStats {
  barberId: string
  professionalId: string
  barberName: string
  avatar?: string
  totalServices: number
  totalProducts: number
  totalRevenue: number
  totalCommission: number
  paidCommission: number
  pendingCommission: number
}

export interface CommissionKpis {
  totalRevenue: number
  totalCommissions: number
  houseNet: number
  pendingPayments: number
}

export interface CommissionSummary {
  kpis: CommissionKpis
  barberStats: BarberCommissionStats[]
  transactions: CommissionTransaction[]
}
