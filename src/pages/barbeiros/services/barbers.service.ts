import api from "@/lib/api"
import type { Barber } from "../types"
import { getActiveUnidadeId } from "@/lib/auth"

const mapProfessionalToBarber = (p: any): Barber => ({
  ...p,
  name: p.user?.name || "",
  email: p.user?.email || "",
  phone: p.user?.phone || "",
  avatarUrl: p.user?.avatarUrl || undefined,
  commissionValue: Number(p.commissionValue) || 0,
  serviceIds: p.services?.map((s: any) => s.serviceId) || [],
  blocks: p.blocks?.map((b: any) => ({
    ...b,
    date: b.date ? b.date.split('T')[0] : "",
  })) || [],
});

export const barbersService = {
  getBarbers: async (): Promise<Barber[]> => {
    const unidadId = getActiveUnidadeId()
    const res = await api.get(`/professionals?unidadeId=${unidadId}`)
    return res.data.map(mapProfessionalToBarber);
  },

  getBarberById: async (id: string): Promise<Barber> => {
    const res = await api.get(`/professionals/${id}`)
    return mapProfessionalToBarber(res.data);
  },

  createBarber: async (data: any): Promise<Barber> => {
    const res = await api.post("/professionals", data)
    return mapProfessionalToBarber(res.data);
  },

  updateBarber: async (id: string, data: any): Promise<Barber> => {
    const res = await api.patch(`/professionals/${id}`, data)
    return mapProfessionalToBarber(res.data);
  },

  deleteBarber: async (id: string): Promise<void> => {
    await api.delete(`/professionals/${id}`)
  }
}
