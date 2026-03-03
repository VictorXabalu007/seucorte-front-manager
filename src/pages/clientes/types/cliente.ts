export interface Cliente {
  id: string
  name: string
  email: string
  phone: string
  type: 'customer' | 'pro'
  planId?: string
  lastVisit?: string
  totalSpent: number
  appointmentsCount: number
  avatar?: string
  status: 'active' | 'inactive'
}
