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

  async getPlanById(id: string): Promise<Plano> {
    const response = await api.get(`/planos/${id}`)
    return response.data
  }

  async getPlanMembers(id: string) {
    const response = await api.get(`/planos/${id}`)
    return response.data.assinaturas || []
  }

  async getDashboardStats(unidadeId: string) {
    const response = await api.get(`/planos/dashboard?unidadeId=${unidadeId}`)
    return response.data
  }

  async getAssinantes(params: { unidadeId: string; page?: number; limit?: number; status?: string }) {
    const response = await api.get('/planos/assinantes', { params })
    return response.data
  }

  async payFatura(faturaId: string) {
    const response = await api.patch(`/planos/faturas/${faturaId}/pay`)
    return response.data
  }

  async generateFatura(assinaturaId: string) {
    const response = await api.post(`/planos/assinaturas/${assinaturaId}/faturas`)
    return response.data
  }

  async getAssinatura(id: string) {
    const response = await api.get(`/planos/assinaturas/${id}`)
    return response.data
  }

  async cancelAssinatura(id: string) {
    const response = await api.patch(`/planos/assinaturas/${id}/cancel`)
    return response.data
  }
}

export const planoService = new PlanoService()
