export interface Cliente {
  id: string
  name: string
  email: string
  phone: string
  cpfCnpj?: string
  rg?: string
  gender?: string
  birthDate?: string
  avatarUrl?: string
  
  // Endereço
  zip?: string
  state?: string
  city?: string
  neighborhood?: string
  street?: string
  number?: string
  
  // Status e Marcadores
  type: 'customer' | 'pro'
  status: 'active' | 'inactive'
  isVip: boolean
  isBlocked: boolean
  internalNotes?: string
  observations?: string

  totalSpent: number
  appointmentsCount: number
  lastVisit?: string
  createdAt: string
  updatedAt: string
  unidadeId: string
  assinaturas?: Array<{
    plano: {
      id: string
      name: string
    }
    isActive: boolean
  }>
}
