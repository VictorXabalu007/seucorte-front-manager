import api from "@/lib/api"
import type { Plano } from "../types/plano"

class PlanoService {
  async getPlans(unidadeId: string): Promise<Plano[]> {
    const response = await api.get(`/planos?unidadeId=${unidadeId}`)
    return response.data
  }

  async createPlan(data: Partial<Plano> & { unidadeId: string }): Promise<Plano> {
    const response = await api.post("/planos", data)
    return response.data
  }

  async updatePlan(id: string, data: Partial<Plano>): Promise<Plano> {
    const response = await api.patch(`/planos/${id}`, data)
    return response.data
  }

  async deletePlan(id: string): Promise<void> {
    await api.delete(`/planos/${id}`)
  }

  async getPlanMembers(id: string) {
    const response = await api.get(`/planos/${id}`)
    return response.data.assinaturas || []
  }
}

export const planoService = new PlanoService()
