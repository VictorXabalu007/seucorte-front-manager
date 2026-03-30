export interface Unidade {
  id: string
  name: string
  address?: string | null
  zip?: string | null
  street?: string | null
  number?: string | null
  complement?: string | null
  neighborhood?: string | null
  city?: string | null
  state?: string | null
  phone?: string | null
  email?: string | null
  logoUrl?: string | null
  isActive: boolean
  ownerId: string
  createdAt: string
  updatedAt: string

  // Rateio de planos
  planRevenueShareEnabled: boolean
  planOwnerMargin: number
}

export interface UnidadeFormData {
  name: string
  address?: string
  zip?: string
  street?: string
  number?: string
  complement?: string
  neighborhood?: string
  city?: string
  state?: string
  phone?: string
  email?: string
  logoUrl?: string
  isActive: boolean
  
  // Rateio de planos
  planRevenueShareEnabled?: boolean
  planOwnerMargin?: number
}
