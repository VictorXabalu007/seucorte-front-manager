import api from "@/lib/api"
import type { Barber } from "../types"
import { MOCK_BARBERS } from "../data/mockData"

const USE_MOCK = true

export const barbersService = {
  getBarbers: async (): Promise<Barber[]> => {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 400))
      return [...MOCK_BARBERS]
    }
    const res = await api.get("/barbers")
    return res.data
  },

  createBarber: async (data: Partial<Barber>): Promise<Barber> => {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 600))
      const newBarber: Barber = {
        id: `b${Date.now()}`,
        name: data.name || "",
        email: data.email || "",
        phone: data.phone,
        specialty: data.specialty,
        bio: data.bio,
        color: data.color || "#baf91a",
        commissionType: data.commissionType || "PERCENTAGE",
        commissionValue: data.commissionValue || 0,
        isActive: data.isActive !== undefined ? data.isActive : true,
        createdAt: new Date().toISOString(),
      }
      MOCK_BARBERS.push(newBarber)
      return newBarber
    }
    const res = await api.post("/barbers", data)
    return res.data
  },

  updateBarber: async (id: string, data: Partial<Barber>): Promise<Barber> => {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 600))
      const idx = MOCK_BARBERS.findIndex(b => b.id === id)
      if (idx >= 0) {
        MOCK_BARBERS[idx] = { ...MOCK_BARBERS[idx], ...data }
        return MOCK_BARBERS[idx]
      }
      throw new Error("Barber not found")
    }
    const res = await api.patch(`/barbers/${id}`, data)
    return res.data
  },

  deleteBarber: async (id: string): Promise<void> => {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 400))
      const idx = MOCK_BARBERS.findIndex(b => b.id === id)
      if (idx >= 0) {
        MOCK_BARBERS[idx].isActive = false
      }
      return
    }
    await api.delete(`/barbers/${id}`)
  }
}
