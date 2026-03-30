import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import api from "@/lib/api"
import type { Appointment, Professional, Service } from "../types"

const mapAppointment = (a: any): Appointment => {
  const primaryService = a.servicos && a.servicos.length > 0 ? a.servicos[0] : null;
  const extraCount = a.servicos ? a.servicos.length - 1 : 0;
  
  let servName = primaryService?.service?.name || "N/A";
  if (extraCount > 0) {
    servName += ` (+${extraCount})`;
  }

  return {
    id: a.id,
    clientName: a.clientName,
    clientPhone: a.clientPhone,
    professionalId: a.professionalId,
    professionalName: a.professional?.user?.name || "N/A",
    serviceId: primaryService?.serviceId || "",
    serviceName: servName,
    serviceDuration: a.serviceDuration,
    date: format(a.startTime ? new Date(a.startTime) : new Date(), "dd MMM, yyyy", { locale: ptBR }),
    rawDate: a.startTime ? new Date(a.startTime) : new Date(),
    startTime: a.startTime ? format(new Date(a.startTime), "HH:mm") : "--:--",
    endTime: a.endTime ? format(new Date(a.endTime), "HH:mm") : "--:--",
    status: a.status,
    paymentStatus: a.paymentStatus,
    amount: Number(a.amount),
    notes: a.notes,
    servicos: a.servicos || [], 
    initials: (a.clientName || "Cliente").split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2),
  };
};

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

  createAppointment: async (data: any): Promise<Appointment> => {
    const payload = { ...data };
    if (payload.serviceId) {
      payload.servicos = [{ serviceId: payload.serviceId, price: Number(payload.amount) || 0 }];
      delete payload.serviceId;
    }
    const res = await api.post("/appointments", payload)
    return mapAppointment(res.data)
  },

  updateAppointment: async (id: string, data: any): Promise<Appointment> => {
    const payload = { ...data };
    // Só atualizamos os serviços se vier `serviceId` do forms simples. 
    // O Checkout PDV vai mandar "servicos" diretamente.
    if (payload.serviceId && !payload.servicos) {
      payload.servicos = [{ serviceId: payload.serviceId, price: Number(payload.amount) || 0 }];
      delete payload.serviceId;
    }
    const res = await api.patch(`/appointments/${id}`, payload)
    return mapAppointment(res.data)
  },

  deleteAppointment: async (id: string): Promise<void> => {
    await api.delete(`/appointments/${id}`)
  },
}
