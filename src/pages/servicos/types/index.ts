export type ServiceCategory = "Cabelo" | "Barba" | "Combo" | "Tratamento" | "Outros"

export interface Service {
  id: string
  name: string
  description?: string
  duration: number // minutes
  price: number
  category: ServiceCategory
  imageUrl?: string
  isActive: boolean
  barberIds: string[]
}

export interface ServiceFormData {
  name: string
  description?: string
  duration: string
  price: string
  category: ServiceCategory
  isActive: boolean
  barberIds: string[]
}
