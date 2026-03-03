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
