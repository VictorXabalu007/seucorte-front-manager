import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import api from "@/lib/api"
import type { Appointment, Professional, Service } from "../types"

const mapAppointment = (a: any): Appointment => ({
  id: a.id,
  clientName: a.clientName,
  clientPhone: a.clientPhone,
  professionalId: a.professionalId,
  professionalName: a.professional?.user?.name || "N/A",
  serviceId: a.serviceId,
  serviceName: a.service?.name || "N/A",
  serviceDuration: a.serviceDuration,
  date: format(new Date(a.startTime), "dd MMM, yyyy", { locale: ptBR }),
  rawDate: new Date(a.startTime),
  startTime: format(new Date(a.startTime), "HH:mm"),
  endTime: format(new Date(a.endTime), "HH:mm"),
  status: a.status,
  paymentStatus: a.paymentStatus,
  amount: Number(a.amount),
  notes: a.notes,
  initials: a.clientName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2),
})

export const agendaService = {
  getAppointments: async (params?: { startDate?: string; endDate?: string; professionalId?: string; unidadeId?: string }): Promise<Appointment[]> => {
    const res = await api.get("/appointments", { params })
    return res.data.map(mapAppointment)
  },

  getAppointmentsPaginated: async (params: any): Promise<{ data: Appointment[], total: number, pages: number }> => {
    const res = await api.get("/appointments", { params })
    return {
      ...res.data,
      data: res.data.data.map(mapAppointment)
    }
  },

  getProfessionals: async (unidadeId?: string): Promise<Professional[]> => {
    const res = await api.get("/professionals", { params: { unidadeId } })
    // Mapeamento para o formato esperado pelo frontend
    return res.data.map((p: any) => ({
      id: p.id,
      name: p.user?.name || "N/A",
      specialty: p.specialty,
      color: p.color || "#10B981", // Usa a cor do banco ou a cor padrão verde
    }))
  },

  getServices: async (unidadeId?: string): Promise<Service[]> => {
    const res = await api.get("/services", { params: { unidadeId } })
    return res.data
  },

  createAppointment: async (data: Partial<Appointment>): Promise<Appointment> => {
    const res = await api.post("/appointments", data)
    return res.data
  },

  updateAppointment: async (id: string, data: Partial<Appointment>): Promise<Appointment> => {
    const res = await api.patch(`/appointments/${id}`, data)
    return res.data
  },

  deleteAppointment: async (id: string): Promise<void> => {
    await api.delete(`/appointments/${id}`)
  },
}
