import api from "@/lib/api"
import type { Service } from "../types"
import { getActiveUnidadeId } from "@/lib/auth"

export const servicesService = {
  getServices: async (unidadeId?: string): Promise<Service[]> => {
    const finalUnidadeId = unidadeId || getActiveUnidadeId()
    const res = await api.get(`/services?unidadeId=${finalUnidadeId}`)
    return res.data.map((s: any) => ({ ...s, price: Number(s.price) }))
  },

  createService: async (data: any): Promise<Service> => {
    const res = await api.post("/services", data)
    const s = res.data
    return { ...s, price: Number(s.price) }
  },

  updateService: async (id: string, data: any): Promise<Service> => {
    const res = await api.patch(`/services/${id}`, data)
    const s = res.data
    return { ...s, price: Number(s.price) }
  },

  deleteService: async (id: string): Promise<void> => {
    await api.delete(`/services/${id}`)
  }
}
