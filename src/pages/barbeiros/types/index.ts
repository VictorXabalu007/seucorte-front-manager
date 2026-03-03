export type CommissionType = "PERCENTAGE" | "FIXED"

export interface Barber {
  id: string
  name: string
  email: string
  phone?: string
  avatarUrl?: string
  specialty?: string
  bio?: string
  color: string
  commissionType: CommissionType
  commissionValue: number
  cutPrice: number
  isActive: boolean
  serviceIds: string[]
  createdAt: string
}

export interface BarberFormData {
  name: string
  email: string
  phone?: string
  specialty?: string
  bio?: string
  color: string
  commissionType: CommissionType
  commissionValue: string // Handle as string for form input
  cutPrice: string // Handle as string for form input
  isActive: boolean
  serviceIds: string[]
}
