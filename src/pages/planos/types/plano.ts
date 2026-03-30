export interface Plano {
  id: string
  name: string
  price: number
  description: string
  features: string[]
  billingCycle: 'monthly' | 'yearly'
  isActive: boolean
  servicos?: Array<{ id: string; name: string }>
}
