import api from "@/lib/api"
import type { Unidade, UnidadeFormData } from "../types"

class UnidadesService {
  async getUnidades(): Promise<Unidade[]> {
    const response = await api.get<Unidade[]>("/unidades")
    return response.data
  }

  async getUnidade(id: string): Promise<Unidade> {
    const response = await api.get<Unidade>(`/unidades/${id}`)
    return response.data
  }

  async createUnidade(data: UnidadeFormData): Promise<Unidade> {
    const response = await api.post<Unidade>("/unidades", data)
    return response.data
  }

  async updateUnidade(id: string, data: Partial<UnidadeFormData>): Promise<Unidade> {
    const response = await api.patch<Unidade>(`/unidades/${id}`, data)
    return response.data
  }

  async deleteUnidade(id: string): Promise<void> {
    await api.delete(`/unidades/${id}`)
  }
}

export const unidadesService = new UnidadesService()
