import type { Appointment, Professional, Service } from "../types"

export const MOCK_PROFESSIONALS: Professional[] = [
  { id: "p1", name: "Ricardo Oliveira", specialty: "Corte Clássico", color: "#10B981" },
  { id: "p2", name: "Marcos Silva", specialty: "Barba & Design", color: "#6366F1" },
  { id: "p3", name: "André Costa", specialty: "Coloração", color: "#F59E0B" },
  { id: "p4", name: "Felipe Santos", specialty: "Degradê", color: "#EC4899" },
]

export const MOCK_SERVICES: Service[] = [
  { id: "s1", name: "Corte Masculino", duration: 30, price: 45 },
  { id: "s2", name: "Barba Completa", duration: 20, price: 30 },
  { id: "s3", name: "Corte + Barba", duration: 50, price: 70 },
  { id: "s4", name: "Degradê", duration: 40, price: 55 },
  { id: "s5", name: "Coloração", duration: 90, price: 120 },
  { id: "s6", name: "Hidratação Capilar", duration: 45, price: 65 },
  { id: "s7", name: "Sobrancelha", duration: 15, price: 20 },
]

export const TIME_SLOTS = Array.from({ length: 102 }, (_, i) => {
  const totalMinutes = 7 * 60 + i * 10 // Starting from 07:00, in 10min increments
  const h = Math.floor(totalMinutes / 60).toString().padStart(2, "0")
  const m = (totalMinutes % 60).toString().padStart(2, "0")
  return `${h}:${m}`
}) // 07:00 to 23:50

const today = new Date()
const mkDate = (daysOffset: number) => {
  const d = new Date(today)
  d.setDate(d.getDate() + daysOffset)
  return d
}

const fmt = (d: Date) => d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })

export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: "a1", clientName: "João Mendes", clientPhone: "11999887766", professionalId: "p1", professionalName: "Ricardo Oliveira", serviceId: "s1", serviceName: "Corte Masculino", serviceDuration: 30, date: fmt(mkDate(0)), rawDate: mkDate(0), startTime: "09:00", endTime: "09:30", status: "CONFIRMED", paymentStatus: "PAID", amount: 45, initials: "JM" },
  { id: "a2", clientName: "Lucas Pereira", clientPhone: "11988776655", professionalId: "p2", professionalName: "Marcos Silva", serviceId: "s2", serviceName: "Barba Completa", serviceDuration: 20, date: fmt(mkDate(0)), rawDate: mkDate(0), startTime: "09:00", endTime: "09:20", status: "SCHEDULED", paymentStatus: "PENDING", amount: 30, initials: "LP" },
  { id: "a3", clientName: "Carlos Souza", professionalId: "p1", professionalName: "Ricardo Oliveira", serviceId: "s3", serviceName: "Corte + Barba", serviceDuration: 50, date: fmt(mkDate(0)), rawDate: mkDate(0), startTime: "10:00", endTime: "10:50", status: "SCHEDULED", paymentStatus: "PENDING", amount: 70, initials: "CS" },
  { id: "a4", clientName: "Thiago Ramos", clientPhone: "11977665544", professionalId: "p3", professionalName: "André Costa", serviceId: "s5", serviceName: "Coloração", serviceDuration: 90, date: fmt(mkDate(0)), rawDate: mkDate(0), startTime: "10:00", endTime: "11:30", status: "CONFIRMED", paymentStatus: "PAID", amount: 120, initials: "TR" },
  { id: "a5", clientName: "Bruno Alves", professionalId: "p4", professionalName: "Felipe Santos", serviceId: "s4", serviceName: "Degradê", serviceDuration: 40, date: fmt(mkDate(0)), rawDate: mkDate(0), startTime: "11:00", endTime: "11:40", status: "SCHEDULED", paymentStatus: "PENDING", amount: 55, initials: "BA" },
  { id: "a6", clientName: "Fernando Lima", clientPhone: "11966554433", professionalId: "p2", professionalName: "Marcos Silva", serviceId: "s3", serviceName: "Corte + Barba", serviceDuration: 50, date: fmt(mkDate(1)), rawDate: mkDate(1), startTime: "09:00", endTime: "09:50", status: "SCHEDULED", paymentStatus: "PENDING", amount: 70, initials: "FL" },
  { id: "a7", clientName: "Mateus Gomes", clientPhone: "11955443322", professionalId: "p1", professionalName: "Ricardo Oliveira", serviceId: "s1", serviceName: "Corte Masculino", serviceDuration: 30, date: fmt(mkDate(1)), rawDate: mkDate(1), startTime: "10:00", endTime: "10:30", status: "SCHEDULED", paymentStatus: "PENDING", amount: 45, initials: "MG" },
  { id: "a8", clientName: "Rafael Costa", professionalId: "p3", professionalName: "André Costa", serviceId: "s6", serviceName: "Hidratação Capilar", serviceDuration: 45, date: fmt(mkDate(2)), rawDate: mkDate(2), startTime: "14:00", endTime: "14:45", status: "SCHEDULED", paymentStatus: "PENDING", amount: 65, initials: "RC" },
  { id: "a9", clientName: "Gustavo Martins", clientPhone: "11944332211", professionalId: "p4", professionalName: "Felipe Santos", serviceId: "s4", serviceName: "Degradê", serviceDuration: 40, date: fmt(mkDate(2)), rawDate: mkDate(2), startTime: "15:00", endTime: "15:40", status: "CONFIRMED", paymentStatus: "PAID", amount: 55, initials: "GM" },
  { id: "a10", clientName: "Pedro Nunes", clientPhone: "11933221100", professionalId: "p1", professionalName: "Ricardo Oliveira", serviceId: "s7", serviceName: "Sobrancelha", serviceDuration: 15, date: fmt(mkDate(-1)), rawDate: mkDate(-1), startTime: "09:00", endTime: "09:15", status: "COMPLETED", paymentStatus: "PAID", amount: 20, initials: "PN" },
  { id: "a11", clientName: "Eduardo Rocha", professionalId: "p2", professionalName: "Marcos Silva", serviceId: "s3", serviceName: "Corte + Barba", serviceDuration: 50, date: fmt(mkDate(-1)), rawDate: mkDate(-1), startTime: "11:00", endTime: "11:50", status: "COMPLETED", paymentStatus: "PAID", amount: 70, initials: "ER" },
  { id: "a12", clientName: "Rodrigo Ferreira", clientPhone: "11922110099", professionalId: "p3", professionalName: "André Costa", serviceId: "s5", serviceName: "Coloração", serviceDuration: 90, date: fmt(mkDate(-1)), rawDate: mkDate(-1), startTime: "14:00", endTime: "15:30", status: "COMPLETED", paymentStatus: "PAID", amount: 120, initials: "RF" },
  { id: "a13", clientName: "Leandro Vieira", professionalId: "p1", professionalName: "Ricardo Oliveira", serviceId: "s1", serviceName: "Corte Masculino", serviceDuration: 30, date: fmt(mkDate(-2)), rawDate: mkDate(-2), startTime: "08:00", endTime: "08:30", status: "NO_SHOW", paymentStatus: "PENDING", amount: 45, initials: "LV" },
  { id: "a14", clientName: "Daniel Borges", clientPhone: "11911009988", professionalId: "p4", professionalName: "Felipe Santos", serviceId: "s4", serviceName: "Degradê", serviceDuration: 40, date: fmt(mkDate(-2)), rawDate: mkDate(-2), startTime: "10:00", endTime: "10:40", status: "CANCELLED", paymentStatus: "REFUNDED", amount: 55, initials: "DB" },
  { id: "a15", clientName: "Vitor Campos", clientPhone: "11900998877", professionalId: "p2", professionalName: "Marcos Silva", serviceId: "s2", serviceName: "Barba Completa", serviceDuration: 20, date: fmt(mkDate(3)), rawDate: mkDate(3), startTime: "13:00", endTime: "13:20", status: "SCHEDULED", paymentStatus: "PENDING", amount: 30, initials: "VC" },
]
