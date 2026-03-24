import api from "@/lib/api"
import type { Service } from "../../servicos/types"

export const combosService = {
  getCombos: async (unidadeId?: string): Promise<Service[]> => {
    const res = await api.get(`/combos?unidadeId=${unidadeId}`)
    return res.data.map((c: any) => ({ ...c, price: Number(c.price) }))
  },

  createCombo: async (data: any): Promise<Service> => {
    const res = await api.post("/combos", data)
    const c = res.data
    return { ...c, price: Number(c.price) }
  },

  updateCombo: async (id: string, data: any): Promise<Service> => {
    const res = await api.patch(`/combos/${id}`, data)
    const c = res.data
    return { ...c, price: Number(c.price) }
  },

  deleteCombo: async (id: string): Promise<void> => {
    await api.delete(`/combos/${id}`)
  }
}
