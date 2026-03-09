export type MetaStatus = "active" | "completed" | "failed" | "pending"
export type MetaType = "revenue" | "bookings" | "new_clients" | "services"

export interface Meta {
  id: string
  title: string
  description?: string
  targetValue: number
  currentValue: number
  type: MetaType
  status: MetaStatus
  startDate: string
  endDate: string
  professionalId?: string
  professionalName?: string
  unitId?: string
  unitName?: string
  createdAt: string
  updatedAt: string
}

export interface MetaFormData {
  title: string
  description?: string
  targetValue: number
  type: MetaType
  startDate: string
  endDate: string
  professionalId?: string
  unitId?: string
  status?: MetaStatus
}
