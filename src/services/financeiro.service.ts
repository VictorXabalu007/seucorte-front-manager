import api from '@/lib/api'
import type { FinancialSummary, FinancialTransaction } from '../pages/financeiro/types'

export const financeiroService = {
  getSummary: async (unidadeId: string, dateFrom?: string, dateTo?: string): Promise<FinancialSummary> => {
    const params = new URLSearchParams()
    params.append('unidadeId', unidadeId)
    if (dateFrom) params.append('dateFrom', dateFrom)
    if (dateTo) params.append('dateTo', dateTo)

    const response = await api.get(`/financeiro/summary?${params.toString()}`)
    return response.data
  },

  getTransactions: async (params: {
    unidadeId: string
    dateFrom?: string
    dateTo?: string
    tipo?: string
    categoria?: string
    origem?: string
    paymentMethod?: string
    search?: string
    page?: number
    limit?: number
  }) => {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString())
      }
    })

    const response = await api.get(`/financeiro/transactions?${searchParams.toString()}`)
    return response.data
  },

  getCashFlowChart: async (unidadeId: string, dateFrom?: string, dateTo?: string) => {
    const params = new URLSearchParams()
    params.append('unidadeId', unidadeId)
    if (dateFrom) params.append('dateFrom', dateFrom)
    if (dateTo) params.append('dateTo', dateTo)

    const response = await api.get(`/financeiro/chart/cashflow?${params.toString()}`)
    return response.data
  },

  getBreakdownChart: async (unidadeId: string, dateFrom?: string, dateTo?: string) => {
    const params = new URLSearchParams()
    params.append('unidadeId', unidadeId)
    if (dateFrom) params.append('dateFrom', dateFrom)
    if (dateTo) params.append('dateTo', dateTo)

    const response = await api.get(`/financeiro/chart/breakdown?${params.toString()}`)
    return response.data
  },

  createTransaction: async (data: any) => {
    const response = await api.post('/financeiro/transactions', data)
    return response.data
  },

  updateTransaction: async (id: string, data: any) => {
    const response = await api.put(`/financeiro/transactions/${id}`, data)
    return response.data
  },

  deleteTransaction: async (id: string) => {
    const response = await api.delete(`/financeiro/transactions/${id}`)
    return response.data
  },
  
  exportCsvUrl: (unidadeId: string, dateFrom?: string, dateTo?: string) => {
    const params = new URLSearchParams()
    params.append('unidadeId', unidadeId)
    if (dateFrom) params.append('dateFrom', dateFrom)
    if (dateTo) params.append('dateTo', dateTo)

    return `${import.meta.env.VITE_API_URL}/financeiro/export?${params.toString()}`
  }
}
