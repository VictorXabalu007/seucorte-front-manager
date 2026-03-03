export interface Plano {
  id: string
  name: string
  price: number
  description: string
  features: string[]
  billingCycle: 'monthly' | 'yearly'
  active: boolean
}
