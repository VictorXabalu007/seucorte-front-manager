import api from "@/lib/api"
import type { CommissionSummary } from "@/pages/comissao/types"

export interface GetStatsParams {
  unidadeId: string
  month: number
  year: number
}

export interface GetTransactionsParams extends GetStatsParams {
  professionalId?: string
  isPago?: "true" | "false"
  tipo?: "PLANO" | "AVULSO"
  search?: string
  page?: number
  limit?: number
}

export const comissoesService = {
  async getStats(params: GetStatsParams) {
    const { data } = await api.get("/comissoes/stats", { params })
    return data as { kpis: CommissionSummary["kpis"]; barberStats: CommissionSummary["barberStats"] }
  },

  async getTransactions(params: GetTransactionsParams) {
    const { data } = await api.get("/comissoes/transactions", { params })
    return data as {
      data: CommissionSummary["transactions"]
      total: number
      page: number
      pages: number
    }
  },

  async pagarComissao(id: string) {
    const { data } = await api.patch(`/comissoes/${id}/pagar`)
    return data
  },

  async liquidarBarbeiro(professionalId: string, params: GetStatsParams) {
    const { data } = await api.patch(`/comissoes/liquidar/${professionalId}`, null, { params })
    return data
  },

  // ─── Repasse Mensal de Planos ───

  async getRepasseStats(params: GetStatsParams) {
    const { data } = await api.get("/comissoes/repasse/stats", { params })
    return data as {
      isCalculated: boolean
      receitaTotal: number
      margemDono: number
      valorDistribuido: number
      fichaTotalMes: number
      planRevenueShareEnabled: boolean
      planOwnerMargin: number
      barbeiros: Array<{
        professionalId: string
        nome: string
        avatar: string | null
        fichas: number
        percentual: number
        valor: number
        isPago: boolean
        revenueShareEnabled?: boolean
      }>
    }
  },

  async calcularRepasse(params: GetStatsParams) {
    const { data } = await api.post("/comissoes/repasse/calcular", null, { params })
    return data
  },

  async liquidarRepasse(params: GetStatsParams) {
    const { data } = await api.patch("/comissoes/repasse/liquidar", null, { params })
    return data
  },

  async toggleBarberRevenueShare(professionalId: string, enabled: boolean) {
    const { data } = await api.patch(`/comissoes/repasse/toggle-barber/${professionalId}`, { enabled })
    return data
  },
  
  async toggleUnidadeRevenueShare(params: { unidadeId: string, enabled: boolean, margin: number }) {
    const { unidadeId, ...body } = params
    const { data } = await api.patch("/comissoes/repasse/toggle-unidade", body, { params: { unidadeId } })
    return data
  },
}
