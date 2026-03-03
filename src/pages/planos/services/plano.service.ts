import type { Plano } from "../types/plano"

class PlanoService {
  async getPlans(): Promise<Plano[]> {
    // Simulating API call
    return this.getMockPlans()
  }

  getMockPlans(): Plano[] {
    return [
      {
        id: "1",
        name: "Plano Barba & Cabelo",
        price: 89.90,
        description: "Acesso ilimitado a cortes de cabelo e barba.",
        features: ["Corte ilimitado", "Lavagem inclusa", "1 Bebida cortesia/mês"],
        billingCycle: "monthly",
        active: true
      },
      {
        id: "2",
        name: "Plano Premium",
        price: 149.90,
        description: "O plano mais completo para quem não abre mão do estilo.",
        features: ["Corte e Barba ilimitados", "Sobrancelha inclusa", "2 Bebidas cortesia/mês", "Desconto em produtos"],
        billingCycle: "monthly",
        active: true
      },
      {
        id: "3",
        name: "Plano Kids",
        price: 59.90,
        description: "Estilo para os pequenos.",
        features: ["2 Cortes por mês", "Ambiente temático"],
        billingCycle: "monthly",
        active: true
      }
    ]
  }
}

export const planoService = new PlanoService()
