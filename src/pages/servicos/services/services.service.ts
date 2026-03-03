import api from "@/lib/api"
import type { Service } from "../types"
import { MOCK_SERVICES } from "../data/mockData"

const USE_MOCK = true

export const servicesService = {
  getServices: async (): Promise<Service[]> => {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 400))
      return [...MOCK_SERVICES]
    }
    const res = await api.get("/services")
    return res.data
  },

  createService: async (data: Partial<Service>): Promise<Service> => {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 600))
      const newService: Service = {
        id: `s${Date.now()}`,
        name: data.name || "",
        description: data.description,
        duration: data.duration || 30,
        price: data.price || 0,
        category: data.category || "Outros",
        isActive: data.isActive !== undefined ? data.isActive : true,
      }
      MOCK_SERVICES.push(newService)
      return newService
    }
    const res = await api.post("/services", data)
    return res.data
  },

  updateService: async (id: string, data: Partial<Service>): Promise<Service> => {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 600))
      const idx = MOCK_SERVICES.findIndex(s => s.id === id)
      if (idx >= 0) {
        MOCK_SERVICES[idx] = { ...MOCK_SERVICES[idx], ...data }
        return MOCK_SERVICES[idx]
      }
      throw new Error("Service not found")
    }
    const res = await api.patch(`/services/${id}`, data)
    return res.data
  },

  deleteService: async (id: string): Promise<void> => {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 400))
      const idx = MOCK_SERVICES.findIndex(s => s.id === id)
      if (idx >= 0) {
        MOCK_SERVICES[idx].isActive = false
      }
      return
    }
    await api.delete(`/services/${id}`)
  }
}
