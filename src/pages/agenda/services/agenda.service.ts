import api from "@/lib/api"
import type { Appointment, Professional, Service } from "../types"
import { MOCK_APPOINTMENTS, MOCK_PROFESSIONALS, MOCK_SERVICES } from "../data/mockData"

// Toggle this to false when the real API is ready
const USE_MOCK = true

export const agendaService = {
  getAppointments: async (params?: { startDate?: string; endDate?: string; professionalId?: string }): Promise<Appointment[]> => {
    if (USE_MOCK) {
      // Simulate network delay
      await new Promise(r => setTimeout(r, 400))
      return MOCK_APPOINTMENTS
    }
    const res = await api.get("/appointments", { params })
    return res.data
  },

  getProfessionals: async (): Promise<Professional[]> => {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 200))
      return MOCK_PROFESSIONALS
    }
    const res = await api.get("/professionals")
    return res.data
  },

  getServices: async (): Promise<Service[]> => {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 200))
      return MOCK_SERVICES
    }
    const res = await api.get("/services")
    return res.data
  },

  createAppointment: async (data: Partial<Appointment>): Promise<Appointment> => {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 600))
      const newApt: Appointment = {
        id: `a${Date.now()}`,
        clientName: data.clientName || "",
        clientPhone: data.clientPhone,
        professionalId: data.professionalId || "",
        professionalName: MOCK_PROFESSIONALS.find(p => p.id === data.professionalId)?.name || "",
        serviceId: data.serviceId || "",
        serviceName: MOCK_SERVICES.find(s => s.id === data.serviceId)?.name || "",
        serviceDuration: MOCK_SERVICES.find(s => s.id === data.serviceId)?.duration || 30,
        date: data.date || "",
        rawDate: data.rawDate || new Date(),
        startTime: data.startTime || "09:00",
        endTime: data.endTime || "09:30",
        status: data.status || "SCHEDULED",
        paymentStatus: data.paymentStatus || "PENDING",
        amount: data.amount || 0,
        notes: data.notes,
        initials: (data.clientName || "?").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
      }
      MOCK_APPOINTMENTS.push(newApt)
      return newApt
    }
    const res = await api.post("/appointments", data)
    return res.data
  },

  updateAppointment: async (id: string, data: Partial<Appointment>): Promise<Appointment> => {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 600))
      const idx = MOCK_APPOINTMENTS.findIndex(a => a.id === id)
      if (idx >= 0) {
        MOCK_APPOINTMENTS[idx] = { ...MOCK_APPOINTMENTS[idx], ...data }
        return MOCK_APPOINTMENTS[idx]
      }
      throw new Error("Appointment not found")
    }
    const res = await api.patch(`/appointments/${id}`, data)
    return res.data
  },

  deleteAppointment: async (id: string): Promise<void> => {
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 400))
      const idx = MOCK_APPOINTMENTS.findIndex(a => a.id === id)
      if (idx >= 0) MOCK_APPOINTMENTS.splice(idx, 1)
      return
    }
    await api.delete(`/appointments/${id}`)
  },
}
