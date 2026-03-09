export interface Unidade {
  id: string
  name: string
  address?: string | null
  phone?: string | null
  email?: string | null
  logoUrl?: string | null
  isActive: boolean
  ownerId: string
  createdAt: string
  updatedAt: string
}

export interface UnidadeFormData {
  name: string
  address?: string
  phone?: string
  email?: string
  logoUrl?: string
  isActive: boolean
}
