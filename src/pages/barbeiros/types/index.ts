export type CommissionType = "PERCENTAGE" | "FIXED"

export interface BarberSchedule {
  dayOfWeek: number
  isWorking: boolean
  startTime1?: string
  endTime1?: string
  startTime2?: string
  endTime2?: string
}

export interface BarberBlock {
  date: string
  startTime?: string
  endTime?: string
  type: "VACATION" | "DAY_OFF" | "BLOCK"
  reason?: string
}

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
  isActive: boolean
  serviceIds: string[]
  schedules: BarberSchedule[]
  blocks: BarberBlock[]
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
  commissionValue: number
  isActive: boolean
  serviceIds: string[]
  schedules: BarberSchedule[]
  blocks: BarberBlock[]
}
