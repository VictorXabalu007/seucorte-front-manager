export interface Appointment {
  id: string
  clientName: string
  clientPhone?: string
  professionalId: string
  professionalName: string
  serviceId: string
  serviceName: string
  serviceDuration: number // minutes
  date: string // "dd MMM, yyyy"
  rawDate: Date
  startTime: string // "HH:mm"
  endTime: string // "HH:mm"
  status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED'
  amount: number
  notes?: string
  initials: string
  hasActivePlan?: boolean
  planName?: string
  cliente?: {
    id: string
    assinaturas: Array<{
      id: string
      isActive: boolean
      plano: {
        id: string
        name: string
        price: number
        servicos: Array<{ id: string }>
      }
    }>
  }
  servicos?: {
    id: string
    serviceId: string
    price: number
    isPlano: boolean
    service: {
      id: string
      name: string
      duration: number
    }
  }[]
  produtos?: {
    id: string
    produtoId: string
    quantity: number
    priceCharged: number
    produto?: {
      id: string
      name: string
      stock: number
    }
  }[]
}

export interface Professional {
  id: string
  name: string
  specialty?: string
  color: string // hex color for calendar display
}

export interface Service {
  id: string
  name: string
  duration: number // minutes
  price: number
  creditsCost: number
}

export interface AppointmentFormData {
  clientName: string
  clientPhone: string
  professionalId: string
  serviceId: string
  dateObj: Date
  startTime: string
  endTime: string
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED'
  status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
  amount: number
  notes?: string
}
